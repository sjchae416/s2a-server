const express = require('express');
const router = express.Router();
const App = require('../models/App');
const User = require('../models/User');
const View = require('../models/View');
const validateEmail = require('../utils/validateEmail');

// function compareRoles(oldRoles, newRoles) {
//   const oldEmails = getEmailsFromRoles(oldRoles);
//   const newEmails = getEmailsFromRoles(newRoles);

//   const addedEmails = newEmails.filter(email => !oldEmails.includes(email));
//   const removedEmails = oldEmails.filter(email => !newEmails.includes(email));

//   return { addedEmails, removedEmails };
// }

// function getEmailsFromRoles(roles) {
//   const emails = [];
//   for (const key in roles) {
//     emails.push(...roles[key]);
//   }
//   return emails;
// }

// ROUTE Crud - create an App
router.post('/', async (req, res) => {
	// REVIEW deleted dataSources and views becuase the client will not be able to pass at this point
	const { name, creator, roles, roleMembershipSheet, published } = req.body;

	try {
		const newApp = await App.create({
			name: name,
			creator: creator,
			roles: roles,
			roleMembershipSheet: roleMembershipSheet,
			published: published,
		});

		//Iterates through the array of values under each key in the roles object.
		for (let key in newApp.roles) {
			for (let i = 0; i < newApp.roles[key].length; i++) {
				let email = newApp.roles[key][i];

				if (validateEmail(email)) {
					//If the user exists, update the user's apps array with the new app's id.
					if (await User.exists({ email: email })) {
						const updatedUser = await User.findOne({ email: email });
						console.log('User found: ', updatedUser);
						updatedUser.apps.push(newApp._id);
						await updatedUser.save();
						console.log('User updated successfully:', updatedUser);
					}
					//If the user does not exist, create a new user and add the app to their apps array.
					else {
						const newUser = await User.create({
							email: email,
							apps: [newApp._id],
						});
						console.log('New user created successfully: ', newUser);
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
	// FIXME The user is not being updated when the app is updated (app id not correctly being updated in the user model)
	const id = req.params.id;
	const update = req.body;

	try {
		//   const currentApp = await App.findById(id)

		//   // Check if roles have been updated
		//   if (update.roles) {
		//     const oldRoles = currentApp.roles;
		//     const newRoles = update.roles;

		//     // Get added and removed emails
		//     const { addedEmails, removedEmails } = compareRoles(oldRoles, newRoles);

		//     // Process added emails
		//     for (const email of addedEmails) {
		//       if (validateEmail(email)) {
		//         if (await User.exists({ email: email })) {
		//           const updatedUser = await User.findOne({ email: email });
		//           updatedUser.apps.push(id);
		//           await updatedUser.save();
		//         } else {
		//           await User.create({ email: email, apps: [id] });
		//         }
		//       }
		//     }

		//     // Process removed emails
		//     for (const email of removedEmails) {
		//       if (validateEmail(email)) {
		//         const updatedUser = await User.findOne({ email: email });
		//         if (updatedUser) {
		//           updatedUser.apps.pull(id);
		//           await updatedUser.save();
		//         }
		//       }
		//     }
		//   }

		await App.findByIdAndUpdate(id, update);
		console.log(`App ${id} updated successfully`);

		res.status(204).send();
	} catch (error) {
		console.error('Error while updating app: ', error);

		res.status(500).json({ message: `Failed to update App ${id}` });
	}
});

// ROUTE cruD - delete an App
// FIXME delete all app-scpViews when App deleted
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		// const deletedApp = await App.findByIdAndDelete(id);
		// console.log('App deleted successfully', deletedApp);

		// res.status(200).json(deletedApp);

		// find an App by id
		// store App.views
		// map and delete all Views in App.views

		const app = await App.findById(id);

		if (!app) {
			return res.status(404).send(`App ${id} not found`);
		}

		const appViews = app.views;

		for (const viewId of appViews) {
			await View.findByIdAndDelete(viewId);
		}

		await app.delete();

		// await App.findByIdAndDelete(id);
		console.log(`App ${id} deleted successfully`);

		//Remove the app id from the apps array of all users who have access to it.
		const update = { $pull: { apps: id } };
		await User.updateMany({ apps: id }, update);

		res.status(204).send();
	} catch (error) {
		console.error('Error while deleting app: ', error);

		res.status(500).json({ message: `Failed to delete App ${id}` });
	}
});

module.exports = router;
