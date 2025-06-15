
import { GenerateResults } from './models';



export function logGeneratedResults(results : GenerateResults)  {
    
    console.log('\nGenerated Interfaces:');
    results.interfaces.forEach(f => console.log(`\tInterface: ${f}`));
    console.log('\nGenerated Services:');
    results.services.forEach(f => console.log(`\tService: ${f}`));
    
    console.log('\nGenerated Routes:');
    results.services.forEach(f => console.log(`\tRoute: ${f}`));
}