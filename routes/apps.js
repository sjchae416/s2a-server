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
	const {
		name,
		creator,
		tables,
		views,
		roleMembershipSheet,
		published,
		createdAt,
		lastModifiedDate,
		lastOpenedDate,
	} = req.body;

	try {
		const newApp = await App.create({
			name: name,
			creator: creator,
			tables: tables,
			views: views,
			roleMembershipSheet: roleMembershipSheet,
			published: published,
			createdAt: createdAt,
			lastModifiedDate: lastModifiedDate,
			lastOpenedDate: lastOpenedDate,
		});

		// FIXME App.roles does not exits anymore! Use the app.roleMembershipSheet
		// NOTE Iterates through the array of values under each key in the roles object.
		for (let key in newApp.roles) {
			for (let i = 0; i < newApp.roles[key].length; i++) {
				let email = newApp.roles[key][i];

				// REVIEW no use of validation anymore and reasons discussed and action agreed
				// if (validateEmail(email)) {
				// NOTE If the user exists, update the user's apps array with the new app's id.
				if (await User.exists({ email: email })) {
					const updatedUser = await User.findOne({ email: email });
					console.log('User found: ', updatedUser);
					updatedUser.apps.push(newApp._id);
					await updatedUser.save();
					console.log('User updated successfully:', updatedUser);
				}
				// NOTE If the user does not exist, create a new user and add the app to their apps array.
				else {
					const newUser = await User.create({
						email: email,
						apps: [newApp._id],
					});
					console.log('New user created successfully: ', newUser);
				}
				// }
			}
		}
		console.log('New app created successfully: ', newApp);

		res.status(201).json(newApp);
	} catch (error) {
		console.error('Error while creating new app: ', error);

		if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
			res.status(400).json({
				message: 'The app name already exists!',
				code: error.code,
				keyPattern: error.keyPattern,
			});
		} else {
			res.status(500).json({ message: `Failed to create new App ${name}` });
		}
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

		const updatedApp = await App.findByIdAndUpdate(id, update);
		console.log(`App ${id} updated successfully`);

		res.status(200).json(updatedApp);
	} catch (error) {
		console.error('Error while updating app: ', error);

		res.status(500).json({ message: `Failed to update App ${id}` });
	}
});

// ROUTE cruD - delete an App
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const app = await App.findById(id);
		const appViews = app.views;
		for (const viewId of appViews) {
			try {
				await View.findByIdAndDelete(viewId);
			} catch (error) {
				console.error('Error deleting a View: ', error);
				return res.status(404).json({ message: `View ${viewId} not found` });
			}
		}
		try {
			// NOTE Remove the app id from the apps array of all users who have access to it.
			// REVIEW if this does not work, move out ouf try-catch
			const update = { $pull: { apps: id } };
			await User.updateMany({ apps: id }, update);
		} catch (error) {
			console.error('Error updating Users: ', error);
			return res
				.status(404)
				.json({ message: `Failed to update Users with App ${id}` });
		}
		try {
			await app.delete();
			console.log(`App ${id} deleted successfully`);
			return res.status(204).send();
		} catch (error) {
			console.error('Error while deleting an App: ', error);
			return res.status(500).json({ message: `Failed to delete App ${id}` });
		}
	} catch (error) {
		console.error('Error while finding an App: ', error);
		return res.status(404).json({ message: `App ${id} not found` });
	}
});

module.exports = router;
