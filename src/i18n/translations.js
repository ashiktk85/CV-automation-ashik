export const translations = {
  en: {
    language: {
      label: 'Language',
      english: 'English',
      german: 'German'
    },
    sidebar: {
      dashboard: 'Dashboard',
      applications: 'Applications',
      shopify: 'Shopify',
      gcms: 'GCMS',
      saved: 'Saved Applications',
      rejected: 'Rejected CVs',
      logout: 'Logout',
      collapse: 'Collapse',
      expand: 'Expand'
    },
    search: {
      placeholder: 'Search name or email...'
    },
    common: {
      filter: 'Filter',
      sort: 'Sort',
      refresh: 'Refresh',
      clearFilter: 'Clear Filter',
      minScore: 'Min Score',
      clear: 'Clear',
      clearSelection: 'Clear Selection',
      deleteSelected: 'Delete Selected',
      deleteAll: 'Delete All',
      realTime: 'Real-time updates enabled',
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      loading: 'Loading...',
      cancel: 'Cancel',
      delete: 'Delete',
      close: 'Close',
      sortBy: 'Sort By',
      date: 'Date',
      languageSwitch: 'Language',
      newCv: 'New CV received!'
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of accepted CVs',
      stats: {
        totalHeading: 'Total Accepted',
        totalDesc: 'CVs meeting acceptance criteria',
        totalSmall: '{{today}} today · {{week}} this week',
        todayHeading: 'Today',
        todayDesc: 'Accepted in the last 24 hours',
        todaySmall: 'Last 24 hours',
        weekHeading: 'This Week',
        weekDesc: 'Accepted in the last 7 days',
        weekSmall: 'Last 7 days',
        monthHeading: 'This Month',
        monthDesc: 'Accepted in the last 30 days',
        monthSmall: 'Last 30 days'
      }
    },
    shopify: {
      title: 'Shopify Applications',
      subtitle: 'View and manage Shopify developer applicants',
      stats: {
        totalHeading: 'Total Applications',
        totalDesc: 'Shopify CVs received',
        totalSmall: '{{today}} today · {{week}} this week',
        todayHeading: 'Today',
        todayDesc: 'Received in the last 24 hours',
        todaySmall: 'Last 24 hours',
        weekHeading: 'This Week',
        weekDesc: 'Submitted in the last 7 days',
        weekSmall: 'Last 7 days',
        monthHeading: 'This Month',
        monthDesc: 'Submitted in the last 30 days',
        monthSmall: 'Last 30 days'
      }
    },
    gcms: {
      title: 'GCMS Applications',
      subtitle: 'Evaluate GC/GC-MS and lab specialist applicants',
      avgLine: 'Avg score: {{score}}% · Avg groups hit: {{groups}}',
      stats: {
        totalHeading: 'Total Applications',
        totalDesc: 'GCMS CVs received',
        totalSmall: '{{today}} today · {{week}} this week',
        todayHeading: 'Today',
        todayDesc: 'Received in the last 24 hours',
        todaySmall: 'Last 24 hours',
        weekHeading: 'This Week',
        weekDesc: 'Submitted in the last 7 days',
        weekSmall: 'Last 7 days',
        monthHeading: 'This Month',
        monthDesc: 'Submitted in the last 30 days',
        monthSmall: 'Last 30 days'
      }
    },
    rejected: {
      title: 'Rejected CVs',
      subtitle: 'CVs that did not meet the minimum score',
      deleteAll: 'Delete All',
      stats: {
        totalHeading: 'Total Rejected',
        totalDesc: 'CVs below the acceptance cut-off',
        totalSmall: '{{today}} today · {{week}} this week',
        todayHeading: 'With Scores',
        todayDesc: 'Rejected but scored CVs',
        todaySmall: 'Score available',
        weekHeading: 'Unscored',
        weekDesc: 'Rejected without a score',
        weekSmall: 'Score missing',
        monthHeading: 'Avg Score',
        monthDesc: 'Average rejected score',
        monthSmall: 'Mean value'
      },
      deleteModal: {
        title: 'Delete All Rejected CVs',
        body: 'This will permanently delete every rejected CV. This action cannot be undone.'
      }
    },
    saved: {
      title: 'Saved Applications',
      subtitle: 'Starred CVs that need follow-up',
      stats: {
        totalHeading: 'Total Saved',
        totalDesc: 'Starred CVs',
        totalSmall: '{{today}} today · {{week}} this week',
        todayHeading: 'High Priority',
        todayDesc: 'Score ≥ 70',
        todaySmall: 'Top performers',
        weekHeading: 'Average Score',
        weekDesc: 'Mean score of saved CVs',
        weekSmall: 'Score trend',
        monthHeading: 'Needs Review',
        monthDesc: 'Score between 50 and 69',
        monthSmall: 'Follow-up required'
      }
    },
    maintable: {
      loading: 'Loading CVs...',
      empty: 'No CVs found. Upload a CV to get started.',
      columns: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        applied: 'Applied',
        jobTitle: 'Job Title',
        score: 'Score',
        cv: 'CV',
        actions: 'Actions'
      },
      status: {
        accepted: 'Accepted',
        rejected: 'Rejected',
        notEvaluated: 'Not evaluated'
      },
      messages: {
        notScored: 'Not scored',
        noCv: 'No CV available',
        skillsMatched: '{{count}} skills matched'
      },
      copy: {
        email: 'Email copied',
        phone: 'Phone copied',
        error: 'Failed to copy {{field}}'
      },
      buttons: {
        viewCv: 'View CV',
        delete: 'Delete',
        download: 'Download',
        save: 'Save CV',
        unsave: 'Remove from saved',
        copyEmail: 'Copy email',
        copyPhone: 'Copy phone'
      },
      deleteModal: {
        title: 'Delete CV',
        body: 'Are you sure you want to delete the CV for {{name}}? This action cannot be undone.'
      },
      bulkBar: {
        selected: '{{count}} selected'
      },
      bulkModal: {
        title: 'Delete Selected CVs',
        body: 'Delete {{count}} selected CV(s)? This action cannot be undone.'
      },
      reason: {
        noScore: 'No score available for this CV yet.',
        shopifyPass: 'Approved with rank {{rank}} and score {{score}}%. {{exp}} Shopify experience skills and {{tech}} technical skills detected.',
        shopifyExperienceFail: 'Rejected: only {{exp}} Shopify experience skills detected. At least 3 are required.',
        shopifyRejected: 'Rejected: final score {{score}}% did not meet the 50% minimum.',
        gcmsPass: 'Approved with rank {{rank}} and score {{score}}%. {{groups}} GCMS expertise groups detected.',
        gcmsGroupsFail: 'Rejected: only {{groups}} GCMS group(s) found. Need at least {{min}}.',
        gcmsRejected: 'Rejected: final score {{score}}% below the GCMS threshold.'
      },
      reasonLabel: 'Reason',
      experienceSummary: 'Experience level: {{level}}{{years}}',
      experienceYears: ' (~{{years}} yrs)',
      modal: {
        title: 'Applicant Details',
        scoring: 'Scoring Results',
        score: 'Score',
        rank: 'Rank',
        status: 'Status'
      },
      sections: {
        shopifyExperience: 'Shopify Experience Skills',
        technical: 'Technical Skills',
        gcmsGroups: 'GCMS Positive Groups',
        keywordsFor: 'Keywords noted for {{group}}'
      },
      experienceLevels: {
        UNKNOWN: 'Unknown',
        ENTRY: 'Entry (<1 yr)',
        JUNIOR_1_2: 'Junior (1-2 yrs)',
        JUNIOR_2_3: 'Junior (2-3 yrs)',
        MID_4_6: 'Mid-level (4-6 yrs)',
        SENIOR_7_9: 'Senior (7-9 yrs)',
        EXPERT_10_PLUS: 'Expert (10+ yrs)'
      }
    }
  },
  de: {
    language: {
      label: 'Sprache',
      english: 'Englisch',
      german: 'Deutsch'
    },
    sidebar: {
      dashboard: 'Dashboard',
      applications: 'Bewerbungen',
      shopify: 'Shopify',
      gcms: 'GCMS',
      saved: 'Gespeicherte Bewerbungen',
      rejected: 'Abgelehnte Lebensläufe',
      logout: 'Abmelden',
      collapse: 'Einklappen',
      expand: 'Ausklappen'
    },
    search: {
      placeholder: 'Name oder E-Mail suchen...'
    },
    common: {
      filter: 'Filter',
      sort: 'Sortieren',
      refresh: 'Aktualisieren',
      clearFilter: 'Filter entfernen',
      minScore: 'Mindestpunktzahl',
      clear: 'Leeren',
      clearSelection: 'Auswahl löschen',
      deleteSelected: 'Auswahl löschen',
      deleteAll: 'Alle löschen',
      realTime: 'Echtzeit-Updates aktiviert',
      today: 'Heute',
      week: 'Diese Woche',
      month: 'Diesen Monat',
      loading: 'Lade...',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      close: 'Schließen',
      sortBy: 'Sortieren nach',
      date: 'Datum',
      languageSwitch: 'Sprache',
      newCv: 'Neuer Lebenslauf eingegangen!'
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Übersicht der akzeptierten Lebensläufe',
      stats: {
        totalHeading: 'Gesamt akzeptiert',
        totalDesc: 'Lebensläufe, die die Kriterien erfüllen',
        totalSmall: '{{today}} heute · {{week}} diese Woche',
        todayHeading: 'Heute',
        todayDesc: 'Akzeptiert in den letzten 24 Stunden',
        todaySmall: 'Letzte 24 Stunden',
        weekHeading: 'Diese Woche',
        weekDesc: 'Akzeptiert in den letzten 7 Tagen',
        weekSmall: 'Letzte 7 Tage',
        monthHeading: 'Diesen Monat',
        monthDesc: 'Akzeptiert in den letzten 30 Tagen',
        monthSmall: 'Letzte 30 Tage'
      }
    },
    shopify: {
      title: 'Shopify-Bewerbungen',
      subtitle: 'Shopify-Entwickler verwalten',
      stats: {
        totalHeading: 'Gesamtbewerbungen',
        totalDesc: 'Eingegangene Shopify-Lebensläufe',
        totalSmall: '{{today}} heute · {{week}} diese Woche',
        todayHeading: 'Heute',
        todayDesc: 'Eingegangen in den letzten 24 Stunden',
        todaySmall: 'Letzte 24 Stunden',
        weekHeading: 'Diese Woche',
        weekDesc: 'Eingegangen in den letzten 7 Tagen',
        weekSmall: 'Letzte 7 Tage',
        monthHeading: 'Diesen Monat',
        monthDesc: 'Eingegangen in den letzten 30 Tagen',
        monthSmall: 'Letzte 30 Tage'
      }
    },
    gcms: {
      title: 'GCMS-Bewerbungen',
      subtitle: 'GC/GC-MS- und Laborprofile bewerten',
      avgLine: 'Durchschnittlicher Score: {{score}} % · Gruppen: {{groups}}',
      stats: {
        totalHeading: 'Gesamtbewerbungen',
        totalDesc: 'Eingegangene GCMS-Lebensläufe',
        totalSmall: '{{today}} heute · {{week}} diese Woche',
        todayHeading: 'Heute',
        todayDesc: 'Eingegangen in den letzten 24 Stunden',
        todaySmall: 'Letzte 24 Stunden',
        weekHeading: 'Diese Woche',
        weekDesc: 'Eingegangen in den letzten 7 Tagen',
        weekSmall: 'Letzte 7 Tage',
        monthHeading: 'Diesen Monat',
        monthDesc: 'Eingegangen in den letzten 30 Tagen',
        monthSmall: 'Letzte 30 Tage'
      }
    },
    rejected: {
      title: 'Abgelehnte Lebensläufe',
      subtitle: 'Lebensläufe unterhalb der Mindestpunktzahl',
      deleteAll: 'Alle löschen',
      stats: {
        totalHeading: 'Gesamt abgelehnt',
        totalDesc: 'Lebensläufe unter dem Grenzwert',
        totalSmall: '{{today}} heute · {{week}} diese Woche',
        todayHeading: 'Mit Bewertung',
        todayDesc: 'Abgelehnt, aber bewertet',
        todaySmall: 'Score vorhanden',
        weekHeading: 'Ohne Bewertung',
        weekDesc: 'Abgelehnt ohne Score',
        weekSmall: 'Score fehlt',
        monthHeading: 'Durchschnittlicher Score',
        monthDesc: 'Durchschnitt der abgelehnten Scores',
        monthSmall: 'Mittelwert'
      },
      deleteModal: {
        title: 'Alle abgelehnten Lebensläufe löschen',
        body: 'Dadurch werden alle abgelehnten Lebensläufe dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.'
      }
    },
    saved: {
      title: 'Gespeicherte Bewerbungen',
      subtitle: 'Markierte CVs für Nachverfolgung',
      stats: {
        totalHeading: 'Gesamt gespeichert',
        totalDesc: 'Markierte Lebensläufe',
        totalSmall: '{{today}} heute · {{week}} diese Woche',
        todayHeading: 'Hohe Priorität',
        todayDesc: 'Score ≥ 70',
        todaySmall: 'Top-Profile',
        weekHeading: 'Durchschnittlicher Score',
        weekDesc: 'Mittlerer Score der gespeicherten CVs',
        weekSmall: 'Score-Verlauf',
        monthHeading: 'Benötigt Prüfung',
        monthDesc: 'Score zwischen 50 und 69',
        monthSmall: 'Nachverfolgung nötig'
      }
    },
    maintable: {
      loading: 'Lebensläufe werden geladen...',
      empty: 'Keine Lebensläufe gefunden. Lade einen Lebenslauf hoch, um zu starten.',
      columns: {
        name: 'Name',
        email: 'E-Mail',
        phone: 'Telefon',
        applied: 'Eingereicht',
        jobTitle: 'Berufsbezeichnung',
        score: 'Bewertung',
        cv: 'Lebenslauf',
        actions: 'Aktionen'
      },
      status: {
        accepted: 'Akzeptiert',
        rejected: 'Abgelehnt',
        notEvaluated: 'Nicht bewertet'
      },
      messages: {
        notScored: 'Nicht bewertet',
        noCv: 'Kein Lebenslauf verfügbar',
        skillsMatched: '{{count}} Fähigkeiten erkannt'
      },
      copy: {
        email: 'E-Mail kopiert',
        phone: 'Telefonnummer kopiert',
        error: '{{field}} konnte nicht kopiert werden'
      },
      buttons: {
        viewCv: 'Lebenslauf ansehen',
        delete: 'Löschen',
        download: 'Herunterladen',
        save: 'Lebenslauf speichern',
        unsave: 'Aus gespeichert entfernen',
        copyEmail: 'E-Mail kopieren',
        copyPhone: 'Telefonnummer kopieren'
      },
      deleteModal: {
        title: 'Lebenslauf löschen',
        body: 'Möchtest du den Lebenslauf von {{name}} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
      },
      bulkBar: {
        selected: '{{count}} ausgewählt'
      },
      bulkModal: {
        title: 'Ausgewählte Lebensläufe löschen',
        body: '{{count}} ausgewählte CV(s) löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
      },
      reason: {
        noScore: 'Für diesen Lebenslauf liegt noch kein Score vor.',
        shopifyPass: 'Genehmigt mit Rang {{rank}} und Score {{score}} %. {{exp}} Shopify-Erfahrungen und {{tech}} technische Fähigkeiten erkannt.',
        shopifyExperienceFail: 'Abgelehnt: Nur {{exp}} Shopify-Erfahrungen gefunden. Mindestens 3 sind erforderlich.',
        shopifyRejected: 'Abgelehnt: Score {{score}} % liegt unter dem Minimum von 50 %.',
        gcmsPass: 'Genehmigt mit Rang {{rank}} und Score {{score}} %. {{groups}} GCMS-Gruppen erkannt.',
        gcmsGroupsFail: 'Abgelehnt: Nur {{groups}} GCMS-Gruppe(n) gefunden. Mindestens {{min}} erforderlich.',
        gcmsRejected: 'Abgelehnt: Score {{score}} % liegt unter dem GCMS-Grenzwert.'
      },
      reasonLabel: 'Begründung',
      experienceSummary: 'Erfahrungsstufe: {{level}}{{years}}',
      experienceYears: ' (~{{years}} Jahre)',
      modal: {
        title: 'Bewerberdetails',
        scoring: 'Bewertungsergebnisse',
        score: 'Score',
        rank: 'Rang',
        status: 'Status'
      },
      sections: {
        shopifyExperience: 'Shopify-Erfahrungen',
        technical: 'Technische Fähigkeiten',
        gcmsGroups: 'GCMS-Gruppen',
        keywordsFor: 'Schlüsselwörter für {{group}}'
      },
      experienceLevels: {
        UNKNOWN: 'Unbekannt',
        ENTRY: 'Einsteiger (<1 Jahr)',
        JUNIOR_1_2: 'Junior (1-2 Jahre)',
        JUNIOR_2_3: 'Junior (2-3 Jahre)',
        MID_4_6: 'Mid-Level (4-6 Jahre)',
        SENIOR_7_9: 'Senior (7-9 Jahre)',
        EXPERT_10_PLUS: 'Experte (10+ Jahre)'
      }
    }
  }
}

