const express = require('express');
const router = express.Router();
const App = require('../models/App');
const User = require('../models/User');
const validateEmail = require('../global_functions/validateEmail');

// ROUTE Crud - create an App
router.post('/', async (req, res) => {
	const {name, creator, dataSources, views, roles} = req.body;

	try {

		const newApp = await App.create({ name: name, creator: creator, dataSources: dataSources, views: views, roles: roles });
		//Iterates through the array of values under each key in the roles object.
		for(let key in newApp.roles){
			for(let i = 0; i < newApp.roles[key].length; i++){
				let email = newApp.roles[key][i];
				if(validateEmail(newApp.roles[key])){
					//If the user exists, update the user's apps array with the new app's id.
					if(await User.exists({email: email})){
						const user = await User.findOne({email: email});
						user.apps.push(newApp._id);
						await user.save();
					}
					//If the user does not exist, create a new user and add the app to their apps array.
					else{
						const newUser = await User.create({email: email, apps: [newApp._id]});
						await newUser.save();
					}
					
				}

			}
			
		}
		console.log('New app created successfully: ', newApp);

		res.status(201).json(newApp);
	} catch (error) {
		console.error('Error while creating new app: ', error);

		res.status(500).json({ message: `Failed to create new App ${name}` });
	}
});

// ROUTE cRud - read all Apps
router.get('/', async (req, res) => {
	try {
		const apps = await App.find({});
		console.log('All apps found successfully: ', apps);

		res.status(200).json(apps);
	} catch (error) {
		console.error('Error while creating new app: ', error);

		res.status(404).json({ message: 'Apps not found' });
	}
});

// ROUTE cRud - read an App
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const app = await App.findById(id);
		console.log('App found: ', app);

		res.status(200).json(app);
	} catch (error) {
		console.error('Error while finding app: ', error);

		res.status(404).json({ message: `App ${id} not found` });
	}
});

// ROUTE crUd = update an App
router.put('/:id', async (req, res) => {
	const id = req.params.id;
	// NOTE usually updates tables field
	const update = req.body;

	try {
		// const updatedApp = await App.findByIdAndUpdate(id, update, { new: true });
		// console.log('App updated successfully:', updatedApp);

		// res.status(200).json(updatedApp);

		const app = await App.findByIdAndUpdate(id, update);
		console.log(`App ${id} updated successfully: ${app}`);

		res.status(200).json(app);
	} catch (error) {
		console.error('Error while updating app: ', error);

		res.status(500).json({ message: `Failed to update App ${id}` });
	}
});

// ROUTE cruD - delete an App
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		// const deletedApp = await App.findByIdAndDelete(id);
		// console.log('App deleted successfully', deletedApp);

		// res.status(200).json(deletedApp);

		await App.findByIdAndDelete(id);
		console.log(`App ${id} deleted successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while deleting app: ', error);

		res.status(500).json({ message: `Failed to delete App ${id}` });
	}
});

module.exports = router;
