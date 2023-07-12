import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { delay, lastValueFrom } from 'rxjs';


import { OffcanvasService } from './offcanvas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ICustomFood, userData } from 'src/models/user-data.model';



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
		private cdr: ChangeDetectorRef
	) { }
		//todo code clean up!!!
	async ngOnInit(): Promise<void> {
		//so this wont start "undefined"
		this.userCustomFood = this.activeRoute.snapshot.data['Custom_Food']
		this.customFoodDisplay = this.userCustomFood[this.canvasNumber]
		this.registrationForm = this.formBuilder.group({
			name: ['', Validators.required],
			kcal_total: ['', [Validators.required, Validators.pattern("^[0-9]+([.][0-9]{1,2})?$")]],
			carbs: ['', [Validators.required, Validators.pattern("^[0-9]+([.][0-9]{1,2})?$")]],
			protein: ['', [Validators.required, Validators.pattern("^[0-9]+([.][0-9]{1,2})?$")]],
			fat: ['', [Validators.required, Validators.pattern("^[0-9]+([.][0-9]{1,2})?$")]]
		})
	}
	openStaticBackdrop(customFoods:ICustomFood[][]) {
		this.onView(customFoods)
		this.offcanvasService.open(this.content, { backdrop: 'static', position: 'end' },);
		this.renderer.addClass(this.elementRef.nativeElement.ownerDocument.body, 'no-scroll');
	}
	async onView(newCustomFoods:ICustomFood[][]) {
		this.userCustomFood=newCustomFoods
		this.customFoodDisplay = this.userCustomFood[this.canvasNumber]
		if(this.checkSelectedIsDeleted())
			this.storeDeletedSelected()
		console.log(this.checkSelectedIsDeleted())
		console.log("\x1b[45m" + "offcanvas onView()", "CUSTOM_FOOD", this.userCustomFood[this.canvasNumber])
		console.log("\x1b[45m" + "offcanvas onView()", "SELECTED_FOOD", this.selectedFoodToCheck[this.canvasNumber])
		console.log("\x1b[45m" + "offcanvas onView()", "deletedSelectedFood", this.deletedSelectedFood)
	}
	checkSelectedIsDeleted() {
		return this.userCustomFood[this.canvasNumber].length>this.selectedFoodToCheck[this.canvasNumber].length
	}
	//todo this is not efficient this is n^2
	storeDeletedSelected() {
		console.log("running storeDeletedSelected()")
			const selectedFoods = this.selectedFoodToCheck[this.canvasNumber];
			const userFoods = this.userCustomFood[this.canvasNumber];

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
					console.log("STORING DELETED DATA")
				}
			});
		
	}

	selectProduct(product: ICustomFood) {
		// this sends the reference!!
		console.log("\x1b[46m"+"valueChanged.emit","Emitter To selector to update the Selected products. from offcanvas")
		this.valueChanged.emit({ product: product, canvasNumber: this.canvasNumber })
	}
	selectDeletedProduct(product: ICustomFood) {
		const confirmation = confirm('This item is DELETED and will be permanent unselected');
  if (confirmation) {
    const index = this.deletedSelectedFood.findIndex(food => food._id === product._id);
    if (index !== -1) {
      this.deletedSelectedFood.splice(index, 1);
    }
  }
  console.log("\x1b[46m"+"valueChanged.emit","Emitter To selector to update the Deleted Selected products. from offcanvas")
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
		console.log("\x1b[46m"+"closedMenu.emit","Emitter To selector to close the offcanvas. from offcanvas")
		this.closedMenu.emit();
	}

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
			await lastValueFrom(this.customOffcanvasService.updateCustomFood(editProduct));
			this.registrationForm.reset();
			this.cdr.detectChanges();
			console.log("New Custom Products: ", this.userCustomFood)
			//will need to update it so the selector see the correct values
			//one way of do it by re selecting it
			this.selectProduct(editProduct)

		} catch (error: any) {
			console.log("we caught an error Updating the product", error);
			this.message = "Theres an error Updating the product", error
		}
	}
	async deleteProduct(product: any) {
		const confirmation = confirm('Warning!!!\nif this item is selected in other dates its will not be deleted\nare you sure you want to proceeded?');
		if(confirmation){
		const indexOfProduct = this.userCustomFood[this.canvasNumber].indexOf(product);
		try {
			await lastValueFrom(this.customOffcanvasService.deleteCustomProduct(product));

			this.userCustomFood[this.canvasNumber].splice(indexOfProduct, 1);
			this.customFoodDisplay = this.userCustomFood[this.canvasNumber]
			// if product selected then selected it(to remove the selected status)
			if (this.isSelected(product))
				this.selectProduct(product)

		} catch (error: any) {
			console.log("we caught an error Deleting the product", error);
			this.message = "Theres an error Deleting the product", error
		}
	}
	}

}
