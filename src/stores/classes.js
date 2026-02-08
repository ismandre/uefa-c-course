import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getExamForClass } from '@/config/exams'

export const useClassesStore = defineStore('classes', () => {
  const classes = ref([
    {
      id: 1,
      name: 'Pravila nogometne igre',
      abbreviation: 'PNI',
      type: 'Online predavanje',
      materials: {
        presentations: [
          {
            name: 'PNI - Skripta (Nogometna akademija)',
            url: 'https://drive.google.com/file/d/1TS_WmBceVz4rsm0PImKiG_X9FNMp3HWy/view?usp=drive_link',
          },
        ],
        notes: [],
        videos: [
          // {
          //   name: '2025-11-25 1. dio',
          //   url: 'https://drive.google.com/file/d/1peANGnkRYrdaxHoM4AJN60KGSB8_3Xc3/view?usp=drive_link',
          // },
          // {
          //   name: '2025-11-25 2.dio',
          //   url: 'https://drive.google.com/file/d/1F7JmkD1WYdHEJ3zy-BaU9VzXvMb_l_EG/view?usp=drive_link',
          // },
        ],
      },
    },
    {
      id: 2,
      name: 'Osnove didaktike sporta',
      abbreviation: 'ODS',
      questionSource: 'UPS',
      type: 'Online predavanje',
      materials: {
        presentations: [
          {
            name: 'Uvod u didaktiku sporta',
            url: 'https://drive.google.com/file/d/1S-8gBcMx_kKX4l3M9uaL-z6JrwOrivnv/view?usp=sharing',
          },
        ],
        notes: [
          // { name: 'Lecture Notes', url: 'https://drive.google.com/...' },
        ],
        videos: [
          // { name: 'Session Recording', url: 'https://drive.google.com/...' },
          // {
          //   name: '2025-11-07 1. dio',
          //   url: 'https://drive.google.com/file/d/1hPPeSxi74Zcnw8EmnMJHRZMc1BKeumKx/view?usp=drive_link',
          // },
          // {
          //   name: '2025-11-07 2. dio',
          //   url: 'https://drive.google.com/file/d/1BoTGiSfPGYp2O0NXJeQ5DX5v5QomwL-P/view?usp=drive_link',
          // },
        ],
      },
    },
    {
      id: 3,
      name: 'Osnove pedagogije sporta',
      abbreviation: 'OPS',
      questionSource: 'UPS',
      type: 'Online predavanje',
      materials: {
        presentations: [
          {
            name: 'Uvod u pedagogiju sporta',
            url: 'https://drive.google.com/file/d/1k4E3vI55LN4Nu6XJTkH73wslkqc-PuCZ/view?usp=sharing',
          },
        ],
        notes: [],
        videos: [
          // {
          //   name: '2025-11-27',
          //   url: 'https://drive.google.com/file/d/1uPWaNHKC-Ll0ABnBYQiVVq1o_B3x9Dx2/view?usp=drive_link',
          // },
        ],
      },
    },
    {
      id: 4,
      name: 'Uvod u anatomiju i fiziologiju sporta',
      abbreviation: 'UFAF',
      type: 'Online predavanje',
      materials: {
        presentations: [
          {
            name: 'Uvod u funkcionalnu anatomiju i fiziologiju',
            url: 'https://drive.google.com/file/d/19jjvF5lA47KIzmBOBF6QLXg1df6T7DqY/view?usp=sharing',
          },
        ],
        notes: [],
        videos: [
          // {
          //   name: '2025-10-21 1. dio',
          //   url: 'https://drive.google.com/file/d/1-P4o690XxY-Cd5JreZzmpWar-8spZoae/view?usp=drive_link',
          // },
          // {
          //   name: '2025-10-21 2. dio',
          //   url: 'https://drive.google.com/file/d/1StHiM6QZ3PeGOhE5rCHH4JfacgFABjX2/view?usp=drive_link',
          // },
          // {
          //   name: '2025-10-21 3. dio',
          //   url: 'https://drive.google.com/file/d/1xdn7l5EjtadJPr1HAvEcVm3-YXdGgodw/view?usp=drive_link',
          // },
        ],
      },
    },
    {
      id: 5,
      name: 'Uvod u medicinu sporta',
      abbreviation: 'UMS',
      type: 'Online predavanje',
      materials: {
        presentations: [
          {
            name: 'Uvod u medicinu sporta - skripta',
            url: 'https://drive.google.com/file/d/1Q1yfRjelDL4UOzYc-fj7u2N1c15ZVwcr/view?usp=sharing',
          },
        ],
        notes: [],
        videos: [
          // {
          //   name: '2025-11-28',
          //   url: 'https://drive.google.com/file/d/1QP8j2raTLoNSvKTPoHl28zGuB2Y4jbwz/view?usp=drive_link',
          // },
        ],
      },
    },
    {
      id: 6,
      name: 'Zaštita na radu',
      abbreviation: 'ZNR',
      type: 'Online predavanje',
      materials: {
        presentations: [
          // {
          //   name: 'Uvod u medicinu sporta - skripta',
          //   url: 'https://drive.google.com/file/d/1Q1yfRjelDL4UOzYc-fj7u2N1c15ZVwcr/view?usp=sharing',
          // },
        ],
        notes: [],
        videos: [
          // {
          //   name: '2025-11-28',
          //   url: 'https://drive.google.com/file/d/1QP8j2raTLoNSvKTPoHl28zGuB2Y4jbwz/view?usp=drive_link',
          // },
        ],
      },
    },
    {
      id: 7,
      name: 'Zaštita od požara',
      abbreviation: 'ZOP',
      type: 'Online predavanje',
      materials: {
        presentations: [
          // {
          //   name: 'Uvod u medicinu sporta - skripta',
          //   url: 'https://drive.google.com/file/d/1Q1yfRjelDL4UOzYc-fj7u2N1c15ZVwcr/view?usp=sharing',
          // },
        ],
        notes: [],
        videos: [
          // {
          //   name: '2025-11-28',
          //   url: 'https://drive.google.com/file/d/1QP8j2raTLoNSvKTPoHl28zGuB2Y4jbwz/view?usp=drive_link',
          // },
        ],
      },
    },
    // {
    //   id: 6,
    //   name: 'Osnove metodike tehnike',
    //   abbreviation: 'OMT',
    //   type: 'Live',
    //   materials: {
    //     presentations: [],
    //     notes: [],
    //     videos: [],
    //   },
    // },
    // {
    //   id: 7,
    //   name: 'Osnove metodike taktike',
    //   abbreviation: 'OMTK',
    //   type: 'Live',
    //   materials: {
    //     presentations: [],
    //     notes: [],
    //     videos: [],
    //   },
    // },
  ])

  function getClassById(id) {
    return classes.value.find((c) => c.id === id)
  }

  function getExamInfo(classId) {
    return getExamForClass(classId)
  }

  return { classes, getClassById, getExamInfo }
})
