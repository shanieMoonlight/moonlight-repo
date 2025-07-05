import { UpdateTeamFormDto } from "@spider-baby/myid-ui/team";
import { TeamType } from "@spider-baby/myid-io/models";
import { demoAppUserDataArray } from "./fake-user-data";

// Single team with full data including leader and members
export const demoTeamData: UpdateTeamFormDto = {
  id: 'team_customer_001',
  name: 'Customer Success Team',
  description: 'Dedicated team focused on customer onboarding, support, and success initiatives',
  minPosition: 1,
  maxPosition: 5,
  leaderId: 'usr_001', // Alice Williams from fake-user-data
  teamType: 'customer',
  leader: demoAppUserDataArray[0], // Alice Williams
  members: [
    demoAppUserDataArray[0], // Alice Williams (leader)
    demoAppUserDataArray[2]  // Emma Rodriguez
  ]
};

// Minimal team data (only required fields)
export const demoTeamDataMinimal: UpdateTeamFormDto = {
  id: 'team_maintenance_001',
  name: 'System Maintenance',
  minPosition: 1,
  maxPosition: 3,
  teamType: 'maintenance'
  // No description, leaderId, leader, or members
};

// Super team with extended hierarchy
export const demoTeamDataSuper: UpdateTeamFormDto = {
  id: 'team_super_001',
  name: 'Executive Leadership',
  description: 'C-level executives and senior leadership team responsible for strategic direction',
  minPosition: 5,
  maxPosition: 10,
  leaderId: 'usr_002', // Michael Chen from fake-user-data
  teamType: 'super',
  leader: demoAppUserDataArray[1], // Michael Chen
  members: [
    // demoAppUserDataArray[1] // Michael Chen (leader only for now)
  ]
};

// Array of multiple teams for testing lists/grids
export const demoTeamDataArray: UpdateTeamFormDto[] = [
  {
    id: 'team_customer_001',
    name: 'Customer Success Team',
    description: 'Handles customer onboarding and support',
    minPosition: 1,
    maxPosition: 4,
    leaderId: 'usr_001',
    teamType: 'customer',
    leader: demoAppUserDataArray[0],
    members: [
      demoAppUserDataArray[0],
      demoAppUserDataArray[2]
    ]
  },
  {
    id: 'team_maintenance_001',
    name: 'Infrastructure Team',
    description: 'Maintains servers, databases, and system infrastructure',
    minPosition: 2,
    maxPosition: 6,
    leaderId: 'usr_002',
    teamType: 'maintenance',
    leader: demoAppUserDataArray[1],
    members: [
      demoAppUserDataArray[1]
    ]
  },
  {
    id: 'team_super_001',
    name: 'Executive Board',
    description: 'Strategic leadership and company direction',
    minPosition: 7,
    maxPosition: 10,
    teamType: 'super'
    // No leader or members assigned yet
  },
  {
    id: 'team_customer_002',
    name: 'Customer Operations',
    description: 'Day-to-day customer operations and account management',
    minPosition: 1,
    maxPosition: 3,
    leaderId: 'usr_003',
    teamType: 'customer',
    members: [
      demoAppUserDataArray[2]
    ]
  },
  {
    id: 'team_maintenance_002',
    name: 'DevOps Team',
    minPosition: 3,
    maxPosition: 5,
    teamType: 'maintenance'
    // Minimal data - no description, leader, or members
  }
];

// Edge case teams for comprehensive testing
export const demoTeamDataEdgeCases: UpdateTeamFormDto[] = [
  // Team with single position level
  {
    id: 'team_specialist_001',
    name: 'Security Specialists',
    description: 'Highly specialized security experts - all at same level',
    minPosition: 5,
    maxPosition: 5, // Same min/max position
    teamType: 'super'
  },
  
  // Team with wide position range
  {
    id: 'team_customer_wide',
    name: 'Global Customer Division',
    description: 'Large customer team spanning multiple levels from junior to senior',
    minPosition: 1,
    maxPosition: 8,
    teamType: 'customer'
  },
  
  // Team with long name and description
  {
    id: 'team_maintenance_long',
    name: 'Enterprise Infrastructure Maintenance and System Administration Team',
    description: 'This is a very long description that tests how the form and display components handle extensive text content. The team is responsible for maintaining all enterprise-level infrastructure including servers, networks, databases, cloud services, monitoring systems, backup solutions, disaster recovery procedures, and ensuring 99.9% uptime across all critical business systems.',
    minPosition: 2,
    maxPosition: 6,
    teamType: 'maintenance'
  }
];

// Helper function to get team by ID
export function getTeamById(id: string): UpdateTeamFormDto | undefined {
  return demoTeamDataArray.find(team => team.id === id);
}

// Helper function to get teams by type
export function getTeamsByType(type: TeamType): UpdateTeamFormDto[] {
  return demoTeamDataArray.filter(team => team.teamType === type);
}

// Helper function to get teams with leaders
export function getTeamsWithLeaders(): UpdateTeamFormDto[] {
  return demoTeamDataArray.filter(team => team.leaderId && team.leader);
}

// Helper function to get teams without leaders
export function getTeamsWithoutLeaders(): UpdateTeamFormDto[] {
  return demoTeamDataArray.filter(team => !team.leaderId);
}
