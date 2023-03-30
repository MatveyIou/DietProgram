import * as bcryprt from 'bcrypt';

export  function encodePassword
(rawPassword: string) :string
{
    const SALT = bcryprt.genSaltSync()
    return bcryprt.hashSync(rawPassword,SALT)
}