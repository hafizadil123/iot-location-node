import BaseController from './base.controller';
class UsersController extends BaseController {
	whitelist = [
	  'firstName',
	  'lastName',
	  'email',
	  'password',
	  'phoneNumber',
	  'profilePic',
	  'role',
	];



	register = async (_req, _res, next) => {
	 
	  try {
		// start code from here
	  } catch (err) {
	    err.status = 400;
	    next(err);
	  }
	};

	login = async (req, res, next) => {
	
	  try {
	    // See if user exist
	  } catch (err) {
	    err.status = 400;
	    next(err);
	  }
	};

}

export default new UsersController();
