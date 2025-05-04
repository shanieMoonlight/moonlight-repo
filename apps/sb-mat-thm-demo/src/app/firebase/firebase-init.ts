// Import the functions you need from the SDKs you need
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { initializeApp } from "firebase/app";
import { AppSecrets } from "../secrets/firebase-config";


export class FirebaseProviders {

    static readonly all = [
        provideFirebaseApp(() => initializeApp(AppSecrets.FirebaseConfig)),
        provideAnalytics(() => getAnalytics()),
    ]

    static readonly app = provideFirebaseApp(() => initializeApp(AppSecrets.FirebaseConfig))

    static readonly analytics = provideAnalytics(() => getAnalytics())

}
