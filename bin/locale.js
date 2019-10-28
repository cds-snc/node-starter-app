const ejf = require("edit-json-file")

const commander = require('commander')
const program = new commander.Command()
program.version('0.0.1')

program.option('add', 'Add a string to the locale files')
program.option('--key <type>', 'name of key to add, periods must be escaped with \\')
program.parse(process.argv)

if (program.add) { 
  if(!program.key){ 
    console.error('--key is missing')
    return
  }

  
  let en = ejf("./locales/en.json")
  let fr = ejf("./locales/fr.json")
  
  en.set(program.key.toString(),program.key.toString().replace(/\\/g,""))
  fr.set(program.key.toString(),program.key.toString().replace(/\\/g,""))
  en.save()
  fr.save()
}