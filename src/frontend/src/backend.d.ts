import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ParticipantRecord {
    age: bigint;
    occupation: string;
    improvement?: bigint;
    name: string;
    education: string;
    gender: string;
    smokingStatus: string;
    tbContactHistory: string;
    registrationId: string;
    dateTime: string;
    riskLevel?: string;
    preTestScore?: bigint;
    postTestScore?: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllParticipants(): Promise<Array<ParticipantRecord>>;
    getAverageImprovement(): Promise<number>;
    getAveragePostTestScore(): Promise<number>;
    getAveragePreTestScore(): Promise<number>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHighRiskCount(): Promise<bigint>;
    getParticipant(registrationId: string): Promise<ParticipantRecord | null>;
    getTotalParticipants(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerParticipant(name: string, age: bigint, gender: string, education: string, occupation: string, smokingStatus: string, tbContactHistory: string, dateTime: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePostTestScore(registrationId: string, score: bigint): Promise<boolean>;
    savePreTestScore(registrationId: string, score: bigint): Promise<boolean>;
    saveRiskLevel(registrationId: string, riskLevel: string): Promise<boolean>;
}
