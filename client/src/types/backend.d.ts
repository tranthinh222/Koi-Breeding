export interface IModelPagination<T> {
	meta: {
		page: number;
		pageSize: number;
		totalPages: number;
		totalElements: number;
	};
	result: T[];
}

export type KoiShape = "STANDARD" | "BUTTERFLY";
export type ScaleType = "WAGOI" | "DOITSU" | "GINRIN";

export interface IKoiVarient {
	id?: number;
	name: string;
	origin: string;
	variety?: IVariety;
	scaleType: ScaleType;
	shape: KoiShape;
	baseMaxLength: number;
	baseGrowthRate: number;
	midAge: number;
	alphaWeight: number;
	basePrice: number;
	alphaPrice: number;
}

export interface IVariety {
	id?: number;
	name: string;
	description: string;
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
	mutation?: IMutation;
	bornedAt: Date;
	pond?: Pond;
	lifeStage: string;
	father?: Koi;
	mother?: Koi;
	potential: number;
	dictionary?: IKoiVarient;
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
	owner?: IUserData;
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
