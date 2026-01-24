import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useClassesStore = defineStore('classes', () => {
  const classes = ref([
    {
      id: 1,
      name: 'Pravila nogometne igre',
      abbreviation: 'PNI',
      type: 'Online',
      materials: {
        presentations: [
          {
            name: 'PNI - Skripta (Nogometna akademija)',
            url: 'https://drive.google.com/file/d/1TS_WmBceVz4rsm0PImKiG_X9FNMp3HWy/view?usp=drive_link',
          },
        ],
        notes: [],
        videos: [
          {
            name: '2025-11-25 1. dio',
            url: 'https://drive.google.com/file/d/1peANGnkRYrdaxHoM4AJN60KGSB8_3Xc3/view?usp=drive_link',
          },
          {
            name: '2025-11-25 2.dio',
            url: 'https://drive.google.com/file/d/1F7JmkD1WYdHEJ3zy-BaU9VzXvMb_l_EG/view?usp=drive_link',
          },
        ],
      },
    },
    {
      id: 2,
      name: 'Osnove didaktike sporta',
      abbreviation: 'ODS',
      type: 'Online',
      materials: {
        presentations: [
          // { name: 'Week 1 - Introduction', url: 'https://drive.google.com/...' },
        ],
        notes: [
          // { name: 'Lecture Notes', url: 'https://drive.google.com/...' },
        ],
        videos: [
          // { name: 'Session Recording', url: 'https://drive.google.com/...' },
          {
            name: '2025-11-07 1. dio',
            url: 'https://drive.google.com/file/d/1hPPeSxi74Zcnw8EmnMJHRZMc1BKeumKx/view?usp=drive_link',
          },
          {
            name: '2025-11-07 2. dio',
            url: 'https://drive.google.com/file/d/1BoTGiSfPGYp2O0NXJeQ5DX5v5QomwL-P/view?usp=drive_link',
          },
        ],
      },
    },
    {
      id: 3,
      name: 'Osnove pedagogije sporta',
      abbreviation: 'OPS',
      type: 'Online',
      materials: {
        presentations: [],
        notes: [],
        videos: [
          {
            name: '2025-11-27',
            url: 'https://drive.google.com/file/d/1uPWaNHKC-Ll0ABnBYQiVVq1o_B3x9Dx2/view?usp=drive_link',
          },
        ],
      },
    },
    {
      id: 4,
      name: 'Uvod u anatomiju i fiziologiju sporta',
      abbreviation: 'UAFS',
      type: 'Online',
      materials: {
        presentations: [
          {
            name: 'Funkcionalna anatomija i fiziologija',
            url: 'https://drive.google.com/file/d/1zvV8WXMpJqXxXLNPdLKnNWlpKOQtd1U8/view?usp=drive_link',
          },
        ],
        notes: [],
        videos: [
          {
            name: '2025-10-21 1. dio',
            url: 'https://drive.google.com/file/d/1-P4o690XxY-Cd5JreZzmpWar-8spZoae/view?usp=drive_link',
          },
          {
            name: '2025-10-21 2. dio',
            url: 'https://drive.google.com/file/d/1StHiM6QZ3PeGOhE5rCHH4JfacgFABjX2/view?usp=drive_link',
          },
          {
            name: '2025-10-21 3. dio',
            url: 'https://drive.google.com/file/d/1xdn7l5EjtadJPr1HAvEcVm3-YXdGgodw/view?usp=drive_link',
          },
        ],
      },
    },
    {
      id: 5,
      name: 'Uvod u medicinu sporta',
      abbreviation: 'UMS',
      type: 'Online',
      materials: {
        presentations: [],
        notes: [],
        videos: [
          {
            name: '2025-11-28',
            url: 'https://drive.google.com/file/d/1QP8j2raTLoNSvKTPoHl28zGuB2Y4jbwz/view?usp=drive_link',
          },
        ],
      },
    },
    {
      id: 6,
      name: 'Osnove metodike tehnike',
      abbreviation: 'OMT',
      type: 'Live',
      materials: {
        presentations: [],
        notes: [],
        videos: [],
      },
    },
    {
      id: 7,
      name: 'Osnove metodike taktike',
      abbreviation: 'OMTK',
      type: 'Live',
      materials: {
        presentations: [],
        notes: [],
        videos: [],
      },
    },
  ])

  function getClassById(id) {
    return classes.value.find((c) => c.id === id)
  }

  return { classes, getClassById }
})
