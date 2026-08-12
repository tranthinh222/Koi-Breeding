export interface IModelPagination<T> {
	meta: {
		page: number;
		pageSize: number;
		totalPages: number;
		totalElements: number;
	};
	result: T[];
}

export interface IKoiVarient {
	id: number;
	name: string;
	origin: string;
	variety: string;
	scaleType: string;
	shape: string;
	baseMaxLength: number;
	baseGrowthRate: number;
	midAge: number;
	alphaWeight: number;
	basePrice: number;
	alphaPrice: number;
}

export interface IKoi {
	id: number;
	name: string;
	age: number;
	length: number;
	weight: number;
	health: number;
	foodBar: number;
	cureBar: number;
	gender: string;
	price: number;
	mutation: IMutation | null;
	bornedAt: Date;
	pond: Pond;
	lifeStage: string;
	father: Koi | null;
	mother: Koi | null;
	potential: number;
	dictionary: IKoiVarient | null;
	patternScore: number;
	colorScore: number;
	bodyScore: number;
	skinScore: number;
	scaleScore: number;
}

export interface IMutation {
	id: number;
	name: string;
	rate: number;
	value: number;
	description: string;
}

export interface IPond {
	id: number;
	owner: IUserData | null;
	name: string;
	level: number;
	capacity: number;
	waterQuality: number;
	temperature: number;
	pH: number;
	oxygen: number;
	createdAt: Date;
	description: string;
}

export interface IUser {
	id: number;
	username: string;
	password: string;
	email: string;
	birthday: Date;
	gender: string;
	createdAt: Date;
	updatedAt: Date;
	status: string;
	role: string;
	isBanned: boolean;
	exp: number;
	avatarUrl: string;
}

export interface IUserData {
	id: number;
	username: string;
	email: string;
	birthday: Date;
	gender: string;
	avatarUrl: string;
}
