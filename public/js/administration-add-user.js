document.getElementById('imageInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('previewImage').src = e.target.result;
    };
    reader.readAsDataURL(file);
});

var locales = [
    "Afrikaans (South Africa)",
    "Albanian (Albania)",
    "Arabic (Algeria)",
    "Arabic (Bahrain)",
    "Arabic (Egypt)",
    "Arabic (Iraq)",
    "Arabic (Jordan)",
    "Arabic (Kuwait)",
    "Arabic (Lebanon)",
    "Arabic (Libya)",
    "Arabic (Morocco)",
    "Arabic (Oman)",
    "Arabic (Qatar)",
    "Arabic (Saudi Arabia)",
    "Arabic (Syria)",
    "Arabic (Tunisia)",
    "Arabic (U.A.E.)",
    "Arabic (Yemen)",
    "Armenian (Armenia)",
    "Azeri (Cyrillic, Azerbaijan)",
    "Azeri (Latin, Azerbaijan)",
    "Basque (Basque)",
    "Belarusian (Belarus)",
    "Bulgarian (Bulgaria)",
    "Catalan (Catalan)",
    "Chinese (Hong Kong S.A.R.)",
    "Chinese (Macao S.A.R.)",
    "Chinese (People's Republic of China)",
    "Chinese (Singapore)",
    "Chinese (Taiwan)",
    "Croatian (Croatia)",
    "Czech (Czech Republic)",
    "Danish (Denmark)",
    "Divehi (Maldives)",
    "Dutch (Belgium)",
    "Dutch (Netherlands)",
    "English (Australia)",
    "English (Belize)",
    "English (Canada)",
    "English (Caribbean)",
    "English (Ireland)",
    "English (Jamaica)",
    "English (New Zealand)",
    "English (Republic of the Philippines)",
    "English (South Africa)",
    "English (Trinidad and Tobago)",
    "English (United Kingdom)",
    "English (United States)",
    "English (Zimbabwe)",
    "Estonian (Estonia)",
    "Faroese (Faroe Islands)",
    "Finnish (Finland)",
    "French (Belgium)",
    "French (Canada)",
    "French (France)",
    "French (Luxembourg)",
    "French (Principality of Monaco)",
    "French (Switzerland)",
    "Galician (Galician)",
    "Georgian (Georgia)",
    "German (Austria)",
    "German (Germany)",
    "German (Liechtenstein)",
    "German (Luxembourg)",
    "German (Switzerland)",
    "Greek (Greece)",
    "Gujarati (India)",
    "Hebrew (Israel)",
    "Hindi (India)",
    "Hungarian (Hungary)",
    "Icelandic (Iceland)",
    "Indonesian (Indonesia)",
    "Italian (Italy)",
    "Italian (Switzerland)",
    "Japanese (Japan)",
    "Kannada (India)",
    "Kazakh (Kazakhstan)",
    "Kiswahili (Kenya)",
    "Konkani (India)",
    "Korean (Korea)",
    "Kyrgyz (Kyrgyzstan)",
    "Latvian (Latvia)",
    "Lithuanian (Lithuania)",
    "Macedonian (Former Yugoslav Republic of Macedonia)",
    "Malay (Brunei Darussalam)",
    "Malay (Malaysia)",
    "Marathi (India)",
    "Mongolian (Cyrillic, Mongolia)",
    "Norwegian, Bokmål (Norway)",
    "Norwegian, Nynorsk (Norway)",
    "Persian (Iran)",
    "Polish (Poland)",
    "Portuguese (Brazil)",
    "Portuguese (Portugal)",
    "Punjabi (India)",
    "Romanian (Romania)",
    "Russian (Russia)",
    "Sanskrit (India)",
    "Serbian (Cyrillic, Serbia)",
    "Serbian (Latin, Serbia)",
    "Slovak (Slovakia)",
    "Slovenian (Slovenia)",
    "Spanish (Argentina)",
    "Spanish (Bolivia)",
    "Spanish (Chile)",
    "Spanish (Colombia)",
    "Spanish (Costa Rica)",
    "Spanish (Dominican Republic)",
    "Spanish (Ecuador)",
    "Spanish (El Salvador)",
    "Spanish (Guatemala)",
    "Spanish (Honduras)",
    "Spanish (Mexico)",
    "Spanish (Nicaragua)",
    "Spanish (Panama)",
    "Spanish (Paraguay)",
    "Spanish (Peru)",
    "Spanish (PuertoRico)",
    "Spanish (Spain)",
    "Spanish (Uruguay)",
    "Spanish (Venezuela)",
    "Swedish (Finland)",
    "Swedish (Sweden)",
    "Syriac (Syria)",
    "Tamil (India)",
    "Tatar (Russia)",
    "Telugu (India)",
    "Thai (Thailand)",
    "Turkish (Turkey)",
    "Ukrainian (Ukraine)",
    "Urdu (Islamic Republic of Pakistan)",
    "Uzbek (Cyrillic, Uzbekistan)",
    "Uzbek (Latin, Uzbekistan)",
    "Vietnamese (Vietnam)"
  ];
  
  var datalistLocales = document.getElementById("datalistLocales");
  
  locales.forEach(function(locale) {
    var option = document.createElement("option");
    option.value = locale;
    datalistLocales.appendChild(option);
  });

  var timezones = [
    "(UTC-12:00) International Date Line West",
    "(UTC-11:00) Midway Island",
    "(UTC-11:00) Samoa",
    "(UTC-10:00) Hawaii",
    "(UTC-09:00) Alaska",
    "(UTC-08:00) Baja California",
    "(UTC-08:00) Pacific Time (US & Canada)",
    "(UTC-07:00) Arizona",
    "(UTC-07:00) Chihuahua",
    "(UTC-07:00) Mazatlan",
    "(UTC-07:00) Mountain Time (US & Canada)",
    "(UTC-06:00) Central America",
    "(UTC-06:00) Central Time (US & Canada)",
    "(UTC-06:00) Mexico City",
    "(UTC-06:00) Monterrey",
    "(UTC-06:00) Saskatchewan",
    "(UTC-05:00) Bogota",
    "(UTC-05:00) Eastern Time (US & Canada)",
    "(UTC-05:00) Lima",
    "(UTC-05:00) Indiana (East)",
    "(UTC-04:30) Caracas",
    "(UTC-04:00) Asuncion",
    "(UTC-04:00) Atlantic Time (Canada)",
    "(UTC-04:00) Cuiaba",
    "(UTC-04:00) Georgetown, Manaus",
    "(UTC-04:00) Santiago",
    "(UTC-03:30) Newfoundland",
    "(UTC-03:00) Brasilia",
    "(UTC-03:00) Buenos Aires",
    "(UTC-03:00) Cayenne",
    "(UTC-03:00) Fortaleza",
    "(UTC-03:00) Greenland",
    "(UTC-03:00) Montevideo",
    "(UTC-02:00) Mid-Atlantic",
    "(UTC-01:00) Azores",
    "(UTC-01:00) Cape Verde Is.",
    "(UTC) Casablanca",
    "(UTC) Coordinated Universal Time",
    "(UTC) Dublin",
    "(UTC) Lisbon",
    "(UTC) London",
    "(UTC) Monrovia",
    "(UTC) Reykjavik",
    "(UTC+01:00) Amsterdam",
    "(UTC+01:00) Belgrade",
    "(UTC+01:00) Berlin",
    "(UTC+01:00) Bratislava",
    "(UTC+01:00) Brussels",
    "(UTC+01:00) Budapest",
    "(UTC+01:00) Copenhagen",
    "(UTC+01:00) Ljubljana",
    "(UTC+01:00) Madrid",
    "(UTC+01:00) Paris",
    "(UTC+01:00) Prague",
    "(UTC+01:00) Rome",
    "(UTC+01:00) Sarajevo",
    "(UTC+01:00) Skopje",
    "(UTC+01:00) Stockholm",
    "(UTC+01:00) Vienna",
    "(UTC+01:00) Warsaw",
    "(UTC+01:00) West Central Africa",
    "(UTC+01:00) Windhoek",
    "(UTC+01:00) Zagreb",
    "(UTC+02:00) Amman",
    "(UTC+02:00) Athens",
    "(UTC+02:00) Beirut",
    "(UTC+02:00) Bucharest",
    "(UTC+02:00) Cairo",
    "(UTC+02:00) Damascus",
    "(UTC+02:00) Harare",
    "(UTC+02:00) Helsinki",
    "(UTC+02:00) Istanbul",
    "(UTC+02:00) Jerusalem",
    "(UTC+02:00) Minsk",
    "(UTC+02:00) Riga",
    "(UTC+02:00) Sofia",
    "(UTC+02:00) Tallinn",
    "(UTC+02:00) Vilnius",
    "(UTC+03:00) Baghdad",
    "(UTC+03:00) Kuwait",
    "(UTC+03:00) Moscow",
    "(UTC+03:00) Nairobi",
    "(UTC+03:00) Riyadh",
    "(UTC+03:00) Volgograd",
    "(UTC+03:30) Tehran",
    "(UTC+04:00) Abu Dhabi, Muscat",
    "(UTC+04:00) Baku",
    "(UTC+04:00) Tbilisi",
    "(UTC+04:00) Yerevan",
    "(UTC+04:30) Kabul",
    "(UTC+05:00) Ekaterinburg",
    "(UTC+05:00) Islamabad, Karachi",
    "(UTC+05:00) Tashkent",
    "(UTC+05:30) Kolkata",
    "(UTC+05:30) Sri Jayawardenepura",
    "(UTC+05:45) Kathmandu",
    "(UTC+06:00) Dhaka",
    "(UTC+06:00) Novosibirsk",
    "(UTC+06:30) Yangon (Rangoon)",
    "(UTC+07:00) Bangkok",
    "(UTC+07:00) Jakarta",
    "(UTC+07:00) Krasnoyarsk",
    "(UTC+08:00) Beijing",
    "(UTC+08:00) Chongqing",
    "(UTC+08:00) Hong Kong",
    "(UTC+08:00) Irkutsk",
    "(UTC+08:00) Kuala Lumpur",
    "(UTC+08:00) Perth",
    "(UTC+08:00) Singapore",
    "(UTC+08:00) Taipei",
    "(UTC+08:00) Ulaanbataar",
    "(UTC+08:00) Urumqi",
    "(UTC+09:00) Seoul",
    "(UTC+09:00) Tokyo",
    "(UTC+09:00) Yakutsk",
    "(UTC+09:30) Adelaide",
    "(UTC+09:30) Darwin",
    "(UTC+10:00) Brisbane",
    "(UTC+10:00) Guam",
    "(UTC+10:00) Hobart",
    "(UTC+10:00) Port Moresby",
    "(UTC+10:00) Melbourne",
    "(UTC+10:00) Sydney",
    "(UTC+10:00) Vladivostok",
    "(UTC+11:00) Magadan",
    "(UTC+12:00) Auckland, Wellington",
    "(UTC+12:00) Fiji",
    "(UTC+12:00) Kamchatka",
    "(UTC+13:00) Nukualofa"
];

    var datalistTimezones = document.getElementById("datalistTimezones");
    
    timezones.forEach(function(timezone) {
    var option = document.createElement("option");
    option.value = timezone;
    datalistTimezones.appendChild(option);
    });
