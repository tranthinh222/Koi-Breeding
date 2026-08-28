export interface IRestResponse<T> {
	statusCode: number;
	message: string;
	data?: T;
}

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
	imageUrl?: string;
}

export interface IVariety {
	id?: number;
	name: string;
	description: string;
}

export type Gender = "MALE" | "FEMALE";
export type LifeStage = "EGG" | "LARVA" | "FRY" | "JUVENILE" | "ADULT";

export interface IKoi {
	id: number;
	name: string;
	age: number;
	length: number;
	weight: number;
	health: number;
	foodBar: number;
	cureBar: number;
	gender: Gender;
	price: number;
	mutation: IKoiMutation | null;
	bornedAt: Date;
	pondId: number;
	lifeStage: LifeStage;
	father: IKoiParent | null;
	mother: IKoiParent | null;
	potential: number;
	dictionary: IKoiVarient;
	patternScore: number;
	colorScore: number;
	bodyScore: number;
	skinScore: number;
	scaleScore: number;
}

export interface IKoiParent {
	id: number;
	name: string;
	imageUrl?: string;
	isBelongToUser: boolean;
}

export interface IKoiMutation {
	id: number;
	name: string;
}

export interface IKoiPond {
	id: number;
	name: string;
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
	owner: IOwner;
	name: string;
	level: number;
	capacity: number;
	waterQuality: number;
	temperature: number;
	pH: number;
	oxygen: number;
	environmentScore: number;
	createdAt: Date;
	description: string;
}

export type USER_ROLE = "ADMIN" | "USER";

export interface IUser {
	id: number;
	username: string;
	email: string;
	birthday: Date;
	gender: Gender;
	exp: number;
	avatarUrl: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface IOwner {
	id: number;
	username: string;
}

export type ItemType = "FOOD" | "KOI" | "MEDICINE" | "CURRENCY";
export type EffectType = "GROWTH" | "MUTATION" | "WATER_QUALITY";

export interface IItem {
	id: number;
	name: string;
	price: number;
	usageLimit: number;
	itemType: ItemType;
	effectType: EffectType;
	effectValue: number;
	description: string;
	image?: string;
}

export interface IItemInventory {
	id: number;
	itemId: number;
	name: string;
	price: number;
	itemType: ItemType;
	effectType: EffectType;
	effectValue: number;
	description: string;
	quantity: number;
	image?: string;
}
