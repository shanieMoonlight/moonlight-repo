import { JwtPayload } from "../base/jwt/jwt-payload";

export interface MyIdJwtPayload extends JwtPayload {

    "myid.team_id": string; // Team ID
    "myid.team_type": string; // Type of Team (e.g., 'customer', 'maintenance', 'super')
    "myid.team_position": number; // Position within the Team
}