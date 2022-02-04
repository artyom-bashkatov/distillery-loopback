type TarifType = {
  name: string;
  minutes: number | string;
  megabytes: number | string;
  sms: number;
  price: number;
  description: string;
};

type TarrifsArray = TarifType[];

export const tarrifs: TarrifsArray = [
  {
    name: 'COSMO 23',
    minutes: 1700,
    megabytes: 4000,
    sms: 400,
    price: 23000,
    description:
      '1 700 minutes\nMonthly outgoing calls limit within Uzbekistan\n4 000 MB\nMonthly limit of internet traffic for all\n400 SMS\nwithin Uzbekistan\nMonthly tariff fee:\n23 000 soums\nSwap to COSMO 23 tariff: *120#',
  },
  {
    name: 'Special Unlim Turbo',
    minutes: 'UNLIMITED',
    megabytes: 'UNLIMITED*',
    sms: 5000,
    price: 150000,
    description:
      'UNLIMITED calls within Uzbekistan\nUNLIMITED* internet traffic\n5 000 SMS within Uzbekistan\nMonthly tariff fee: 150 000 soums\n* The traffic limit for 30 days to all directions is 100 GB at full speed, after the limit provided at full speed, the Internet speed is reduced and set no higher than 128 kb/s.\nSwap to Special Unlim Turbo tariff *233#',
  },
];

export const balanceVariants: Array<number> = [
  5000, 12000, 45220, 400, 10, 32000, 18300,
];

export function randomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function getServicesForSelectedTarrif(tarrifName: string) {
  switch (tarrifName) {
    case 'COSMO 23':
      return [
        {
          name: 'Mediabay online cinema',
          description:
            'Online TV with CatchUP function (broadcast archive)\nProgram guide for all channels\nAbility to add favorite channels or movies to favorites\nNew movies and TV series of the Amediatek service\nPrograms, videos and much more.',
          price: 16000,
        },
        {
          name: 'SberZvuk music application',
          description: 'Your favorite music with you anywhere and anytime!',
          price: 27000,
        },
        {
          name: 'iTV online cinema',
          description:
            'Enjoy watching movies and TV shows without worrying about traffic! Now it is possible with Ucell.',
          price: 60000,
        },
      ];
    case 'Special Unlim Turbo':
      return [
        {
          name: 'Mediabay online cinema',
          description:
            'Online TV with CatchUP function (broadcast archive)\nProgram guide for all channels\nAbility to add favorite channels or movies to favorites\nNew movies and TV series of the Amediatek service\nPrograms, videos and much more.',
          price: 16000,
        },
        {
          name: 'SberZvuk music application',
          description: 'Your favorite music with you anywhere and anytime!',
          price: 27000,
        },
        {
          name: 'iTV online cinema',
          description:
            'Enjoy watching movies and TV shows without worrying about traffic! Now it is possible with Ucell.',
          price: 60000,
        },
      ];
    default:
      break;
  }
}

export function calculateRemainsData(tarif: TarifType, phone: string) {
  const {minutes, megabytes, sms} = tarif;
  const remainSms = randomNumber(+phone.substring(5, 6), +sms);
  const remainMinutes = randomNumber(+phone.substring(7, 10), +minutes);
  const remainMegabytes = randomNumber(+phone.substring(8, 11), +megabytes);
  return {sms: remainSms, minutes: remainMinutes, megabytes: remainMegabytes};
}
