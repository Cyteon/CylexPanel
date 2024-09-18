import { type UserDocument } from './User';

export interface DataSession {
	authenticated: boolean;
	user: null | UserDocument;
}

export interface Data {
	session: DataSession;
}
