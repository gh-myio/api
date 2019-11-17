const inquirer = require('inquirer')
const models = require('./lib/models').Models

async function main () {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'what_do',
    message: 'What do you want to do?',
    choices: ['New admin']
  }])

  if (answers.what_do === 'New admin') {
    await newUser()
  }
}

async function newUser () {
  const answers = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Enter the user\'s name: '
  }, {
    type: 'input',
    name: 'email',
    message: 'Enter the user\'s e-mail: '
  }, {
    type: 'password',
    name: 'password',
    message: 'Enter the user password: '
  }])

  const user = await models.User.create({
    name: answers.name,
    email: answers.email,
    password: answers.password
  })

  console.log('User created successfully!')
  process.exit(1)
}

main()
