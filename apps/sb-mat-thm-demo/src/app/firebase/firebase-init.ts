// Import the functions you need from the SDKs you need
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { initializeApp } from "firebase/app";
import { environment } from "../../environments/environment";


export class FirebaseProviders {

    static readonly all = [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAnalytics(() => getAnalytics()),
    ]

    // static readonly app = provideFirebaseApp(() => initializeApp(environment.firebaseConfig))

    // static readonly analytics = provideAnalytics(() => getAnalytics())

}
