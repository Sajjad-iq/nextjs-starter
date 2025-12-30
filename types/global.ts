export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    isActivated?: boolean;
    createdAt?: string;
}

export interface OrganizationResponse {
    id: string;
    name: string;
    // Add other organization fields as needed
}
