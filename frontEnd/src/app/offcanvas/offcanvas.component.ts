import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { delay, lastValueFrom } from 'rxjs';


import { OffcanvasService } from './offcanvas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ICustomFood, userData } from 'src/models/user-data.model';
import { UserCustomFoodResolver } from 'src/resolvers/user-custom-food.resolver';


@Component({
	selector: 'app-offcanvas',
	templateUrl: './offcanvas.component.html',
	styleUrls: ['./offcanvas.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class OffcanvasComponent {
	@ViewChild('content') content: TemplateRef<any> | undefined;

	// @Input() maybe redundant. we a calling the component itself in selector
	//TODO Check references
	@Input() canvasNumber!: number
	@Input() selectedFoodToCheck!: ICustomFood[][]
	//userStats!: userData
	@Input() userCustomFood!: ICustomFood[][]
	//userCustomFood:ICustomFood[][] = this.activeRoute.snapshot.data['Custom_Food'];
	//currentDate:string="23-03-25"
	@Output() valueChanged = new EventEmitter<{ product: ICustomFood, canvasNumber: number }>();
	@Output() closedMenu = new EventEmitter<any>();

	customFoodDisplay: ICustomFood[] | undefined
	deletedSelectedFood: ICustomFood[] = []

	name!: string;
	kcal_total!: number;
	carbs!: number;
	protein!: number;
	fat!: number;
	registrationForm: FormGroup | any;
	message: string = ""
	errorMessage: string = ""

	constructor(private formBuilder: FormBuilder,
		private offcanvasService: NgbOffcanvas,
		private activeRoute: ActivatedRoute,
		private customOffcanvasService: OffcanvasService,
		private elementRef: ElementRef,
		private renderer: Renderer2,
		private userCustomFoodResolver: UserCustomFoodResolver,
		private cdr: ChangeDetectorRef
	) { }

	async ngOnInit(): Promise<void> {
		//so this wont start "undefined"
		this.userCustomFood = this.activeRoute.snapshot.data['Custom_Food']
		this.customFoodDisplay = this.userCustomFood[this.canvasNumber]
		this.storeDeletedSelected()
		this.registrationForm = this.formBuilder.group({
			name: ['', Validators.required],
			kcal_total: ['', [Validators.required, Validators.pattern("^[0-9]+([.][0-9]{1,2})?$")]],
			carbs: ['', [Validators.required, Validators.pattern("^[0-9]+([.][0-9]{1,2})?$")]],
			protein: ['', [Validators.required, Validators.pattern("^[0-9]+([.][0-9]{1,2})?$")]],
			fat: ['', [Validators.required, Validators.pattern("^[0-9]+([.][0-9]{1,2})?$")]]
		})
	}
	onView() {
		if(this.deletedSelectedFood.length===0)
			this.storeDeletedSelected()
		this.customFoodDisplay = this.userCustomFood[this.canvasNumber]
		console.log("\x1b[45m" + "offcanvas onView()", "CUSTOM_FOOD", this.userCustomFood)
		console.log("\x1b[45m" + "offcanvas onView()", "SELECTED_FOOD", this.selectedFoodToCheck)

	}
	//todo this is not efficient this is n^3
	storeDeletedSelected() {
		for (let i = 0; i < this.selectedFoodToCheck.length; i++) {
			const selectedFoods = this.selectedFoodToCheck[i];
			const userFoods = this.userCustomFood[i];

			selectedFoods.forEach(food => {
				let flagFound = false
				for (let j = 0; j < userFoods.length; j++) {
					if (userFoods[j]._id == food._id) {
						flagFound = true;
						break
					}
				}
				if (!flagFound) {
					this.deletedSelectedFood.push(food)
				}
			});
		}
	}

	selectProduct(product: ICustomFood) {
		//console.log("will try to emmit", {product:product,canvasNumber:this.canvasNumber})
		this.valueChanged.emit({ product: product, canvasNumber: this.canvasNumber })// this sends the reference!!
	}
	selectDeletedProduct(product: ICustomFood) {
		const confirmation = confirm('This item is DELETED and will be permanent unselected');
  if (confirmation) {
    const index = this.deletedSelectedFood.findIndex(food => food._id === product._id);
    if (index !== -1) {
      this.deletedSelectedFood.splice(index, 1);
    }
  }
  this.valueChanged.emit({ product: product, canvasNumber: this.canvasNumber })
	}
	isSelected(product: ICustomFood) {
		const isContain = this.selectedFoodToCheck[this.canvasNumber].find(food => food._id === product._id)
		//console.log(product," isContain in? ",this.selectedFoodToCheck[this.canvasNumber]," \n",isContain)
		return isContain
	}
	/**
	 * New CustomFood
	 */
	onSubmit() {
		this.message = ""
		this.errorMessage = ""
		const newUserFood: ICustomFood = {
			name: this.registrationForm.get('name').value,
			kcal_total: this.registrationForm.get('kcal_total').value,
			carbs: this.registrationForm.get('carbs').value,
			protein: this.registrationForm.get('protein').value,
			fat: this.registrationForm.get('fat').value
		}
		console.log("submit", newUserFood)
		this.registerProduct(newUserFood);
	}
	async registerProduct(newProduct: ICustomFood) {

		try {
			const response = await lastValueFrom(this.customOffcanvasService.pushCustomProducts(newProduct, this.canvasNumber));
			console.log("before registerProduct", this.userCustomFood)
			console.log("Handle successful response ", response);
			//this.userStats=response.userCustomProductsSchema
			this.registrationForm.reset();
			this.userCustomFood = response.customFood
			this.customFoodDisplay = this.userCustomFood[this.canvasNumber]
			//wow it works
			this.cdr.detectChanges();
			console.log("New Custom Products: ", this.userCustomFood)
			//TODO is this the correct way?


			this.message = "We've saved the product"
		} catch (error: any) {
			console.log("we caught an error", error);
			this.errorMessage = "Theres an error"
		}
	}
	// async getProducts(): Promise<void> {
	// 	this.customOffcanvasService.getSavedProducts().subscribe({
	// 		next: response => {
	// 			console.log('Response from getSavedProducts', response);
	// 			this.userProducts.userCustomProducts = response.userCustomProducts
	// 		},
	// 		error: error => {
	// 			console.log('Error from getSavedProducts', error);
	// 		}
	// 	});
	// }
	openStaticBackdrop() {
		this.offcanvasService.open(this.content, { backdrop: 'static', position: 'end' },);
		this.renderer.addClass(this.elementRef.nativeElement.ownerDocument.body, 'no-scroll');
	}
	//todo if we close with esc it doesn't do this function
	//this is the dumb way to fix that issue... //todo find a better way
	@HostListener('document:keydown.escape', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		this.closeCanvas();
	}
	closeCanvas() {
		//this.updateSelected()
		this.offcanvasService.dismiss('Cross click')
		this.renderer.removeClass(this.elementRef.nativeElement.ownerDocument.body, 'no-scroll');
		this.valueChanged.closed
		this.closedMenu.emit();
	}
	//TODO make this efficient. this function called each time we exit the canvas		
	// async updateSelected() {
	// 	try {
	// 		const response = await lastValueFrom(this.customOffcanvasService.
	// 			updateCustomProducts(
	// 				this.userStats));
	// 		console.log("Handle successful response ", response);
	// 	} catch (error: any) {
	// 		console.log("we caught an error", error);
	// 	}
	// }
	async editProduct(product: any) {
		// Prompt the user to edit the product values
		const newName = prompt("Enter a new name for the product:", product.name);
		const newKcal = prompt("Enter a new kcal_total value for the product:", product.kcal_total);
		const newCarbs = prompt("Enter a new carbs value for the product:", product.carbs);
		const newProtein = prompt("Enter a new protein value for the product:", product.protein);
		const newFat = prompt("Enter a new fat value for the product:", product.fat);

		const validKcal = !isNaN(parseFloat(newKcal!))
		const validCarbs = !isNaN(parseFloat(newCarbs!))
		const validProtein = !isNaN(parseFloat(newProtein!))
		const validFat = !isNaN(parseFloat(newFat!))

		// Update the product values if the user entered valid values
		if (newName && validKcal && validCarbs && validProtein && validFat) {
			product.name = newName;
			product.kcal_total = parseInt(newKcal!);
			product.carbs = parseInt(newCarbs!);
			product.protein = parseInt(newProtein!);
			product.fat = parseInt(newFat!);
			this.updateCustomProducts({
				_id: product._id,
				name: product.name,
				kcal_total: product.kcal_total,
				carbs: product.carbs,
				protein: product.protein,
				fat: product.fat
			})
		}
		else
			alert("Invalid input please try again with valid values.");
	}
	async updateCustomProducts(editProduct: ICustomFood) {
		try {
			const response = await lastValueFrom(this.customOffcanvasService.setEditCustomFood(editProduct));
			console.log("before registerProduct", this.userCustomFood)
			console.log("Handle successful response ", response);
			//this.userStats=response.userCustomProductsSchema
			this.registrationForm.reset();
			//TODO is this the correct way?
			//wow it works
			this.cdr.detectChanges();
			console.log("New Custom Products: ", this.userCustomFood)

			//will need to update it so the selector see the correct values
			//one way of do it by reelecting it
			this.selectProduct(editProduct)
			this.selectProduct(editProduct)
		} catch (error: any) {
			console.log("we caught an error", error);
			this.message = "Theres an error", error
		}
	}
	async deleteProduct(product: any) {
		const index = this.userCustomFood[this.canvasNumber].indexOf(product);

		//this.customOffcanvasService.deleteCustomProduct(product._id)
		try {
			const response = await lastValueFrom(this.customOffcanvasService.deleteCustomProduct(product));
			console.log("Handle successful response ", response);
			this.userCustomFood[this.canvasNumber].splice(index, 1);
			this.customFoodDisplay = this.userCustomFood[this.canvasNumber]
			// if product selected then selected it
			if (this.isSelected(product))
				this.selectProduct(product)
			//TODO this.valueChanged.emit(this.userStats)
		} catch (error: any) {
			console.log("we caught an error", error);
		}
	}

}
