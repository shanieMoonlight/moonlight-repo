import { AppUserCustomerDto, AppUserDto } from "@spider-baby/myid-io/models";


// export interface IdentityAddressDto {
//   streetAddress?: string;
//   city?: string;
//   state?: string;
//   zipCode?: string;
//   country?: string;
// }

// export interface AppUserDto {
//   id?: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   userName: string;
//   email: string;
//   teamId: string;
//   teamPosition: number;
//   twoFactorProvider: TwoFactorProvider;
//   twoFactorEnabled: boolean;
//   address?: IdentityAddressDto;
// }

export const fakeCustomers: AppUserCustomerDto[] = [
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920000",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+353 87 111 1111",
        userName: "johndoe",
        email: "john.doe@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820000",
        teamPosition: 1,
        twoFactorProvider: "Sms",
        twoFactorEnabled: false,
        emailConfirmed: true,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-10T13:51:46.7798084",
        lastModifiedDate: "2025-06-10T13:51:47.4409837"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920001",
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "+353 87 222 2222",
        userName: "janedoe",
        email: "jane.doe@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820001",
        teamPosition: 2,
        twoFactorProvider: "Email",
        twoFactorEnabled: true,
        emailConfirmed: true,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-11T10:00:00.0000000",
        lastModifiedDate: "2025-06-11T10:05:00.0000000"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920002",
        firstName: "Mark",
        lastName: "Murphy",
        phoneNumber: "+353 87 333 3333",
        userName: "markmurphy",
        email: "mark.murphy@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820002",
        teamPosition: 3,
        twoFactorProvider: "Sms",
        twoFactorEnabled: true,
        emailConfirmed: true,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-12T09:00:00.0000000",
        lastModifiedDate: "2025-06-12T09:10:00.0000000"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920003",
        firstName: "Mary",
        lastName: "Smith",
        phoneNumber: "+353 87 444 4444",
        userName: "marysmith",
        email: "mary.smith@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820003",
        teamPosition: 4,
        twoFactorProvider: "AuthenticatorApp",
        twoFactorEnabled: true,
        emailConfirmed: false,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-13T08:00:00.0000000",
        lastModifiedDate: "2025-06-13T08:15:00.0000000"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920004",
        firstName: "Tom",
        lastName: "Brown",
        phoneNumber: "+353 87 555 5555",
        userName: "tombrown",
        email: "tom.brown@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820004",
        teamPosition: 5,
        twoFactorProvider: "Sms",
        twoFactorEnabled: false,
        emailConfirmed: true,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-14T07:00:00.0000000",
        lastModifiedDate: "2025-06-14T07:20:00.0000000"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920005",
        firstName: "Lisa",
        lastName: "White",
        phoneNumber: "+353 87 666 6666",
        userName: "lisawhite",
        email: "lisa.white@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820005",
        teamPosition: 6,
        twoFactorProvider: "Email",
        twoFactorEnabled: true,
        emailConfirmed: false,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-15T06:00:00.0000000",
        lastModifiedDate: "2025-06-15T06:25:00.0000000"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920006",
        firstName: "Paul",
        lastName: "Green",
        phoneNumber: "+353 87 777 7777",
        userName: "paulgreen",
        email: "paul.green@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820006",
        teamPosition: 7,
        twoFactorProvider: "AuthenticatorApp",
        twoFactorEnabled: false,
        emailConfirmed: true,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-16T05:00:00.0000000",
        lastModifiedDate: "2025-06-16T05:30:00.0000000"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920007",
        firstName: "Anna",
        lastName: "Black",
        phoneNumber: "+353 87 888 8888",
        userName: "annablack",
        email: "anna.black@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820007",
        teamPosition: 8,
        twoFactorProvider: "Sms",
        twoFactorEnabled: true,
        emailConfirmed: false,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-17T04:00:00.0000000",
        lastModifiedDate: "2025-06-17T04:35:00.0000000"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920008",
        firstName: "Mike",
        lastName: "Davis",
        phoneNumber: "+353 87 999 9999",
        userName: "mikedavis",
        email: "mike.davis@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820008",
        teamPosition: 9,
        twoFactorProvider: "Email",
        twoFactorEnabled: false,
        emailConfirmed: true,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-18T03:00:00.0000000",
        lastModifiedDate: "2025-06-18T03:40:00.0000000"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920009",
        firstName: "Sara",
        lastName: "Wilson",
        phoneNumber: "+353 87 101 0101",
        userName: "sarawilson",
        email: "sara.wilson@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820009",
        teamPosition: 10,
        twoFactorProvider: "AuthenticatorApp",
        twoFactorEnabled: true,
        emailConfirmed: false,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-19T02:00:00.0000000",
        lastModifiedDate: "2025-06-19T02:45:00.0000000"
    },
    {
        id: "08dda81d-8f47-0aa9-4d95-0a2ba8920010",
        firstName: "Luke",
        lastName: "Taylor",
        phoneNumber: "+353 87 202 0202",
        userName: "luketaylor",
        email: "luke.taylor@example.com",
        teamId: "08dda5d3-bb3d-f5b0-4d95-0a2bcc820010",
        teamPosition: 11,
        twoFactorProvider: "Sms",
        twoFactorEnabled: false,
        emailConfirmed: true,
        address: undefined,
        administratorUsername: "adminuser",
        administratorId: "08dda5d3-bc2f-7e32-4d95-0a2bcc820000",
        dateCreated: "2025-06-20T01:00:00.0000000",
        lastModifiedDate: "2025-06-20T01:50:00.0000000"
    }
];


