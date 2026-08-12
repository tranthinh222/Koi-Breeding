export interface KoiVarient {
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

export interface Koi {
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
	mutation: Mutation | null;
	bornedAt: Date;
	pond: Pond;
	lifeStage: string;
	father: Koi | null;
	mother: Koi | null;
	potential: number;
	dictionary: KoiVarient | null;
	patternScore: number;
	colorScore: number;
	bodyScore: number;
	skinScore: number;
	scaleScore: number;
}

export interface PageDTO<T> {
	page: number;
	pageSize: number;
	data: T[];
	totalPages: number;
	totalElements: number;
}

export interface Mutation {
	id: number;
	name: string;
	rate: number;
	value: number;
	description: string;
}

export interface Pond {
	id: number;
	owner: UserData | null;
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

export interface User {
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

export interface UserData {
	id: number;
	username: string;
	email: string;
	birthday: Date;
	gender: string;
	avatarUrl: string;
}
