# Questions TSV Files

This directory contains quiz questions organized by subject in TSV (Tab-Separated Values) format.

## File Naming Convention

Files must follow this naming pattern:
```
{subject_code}_questions_pt{number}.tsv
```

Examples:
- `pni_questions_pt1.tsv`
- `ufaf_questions_pt2.tsv`
- `ums_questions_pt1.tsv`

### Subject Codes

Map to classes as follows:
- `PNI` - Pravila nogometne igre (Class ID: 1)
- `ODS` - Osnove didaktike sporta (Class ID: 2)
- `OPS` - Osnove pedagogije sporta (Class ID: 3)
- `UAFS` - Uvod u anatomiju i fiziologiju sporta (Class ID: 4)
- `UMS` - Uvod u medicinu sporta (Class ID: 5)
- `OMT` - Osnove metodike tehnike (Class ID: 6)
- `OMTK` - Osnove metodike taktike (Class ID: 7)

## TSV Format

Each TSV file must have the following columns (tab-separated):

```
Predmet	Pitanje	Tip_pitanja	Odgovor_A	Odgovor_B	Odgovor_C	Odgovor_D	Tocan_odgovor	Napomena
```

### Column Descriptions

1. **Predmet** - Subject code (e.g., PNI, UFAF, UMS)
2. **Pitanje** - The question text
3. **Tip_pitanja** - Question type:
   - `visestruki_izbor` - Multiple choice
   - `otvoreno` - Open-ended
4. **Odgovor_A** - Answer option A (empty for open-ended)
5. **Odgovor_B** - Answer option B (empty for open-ended)
6. **Odgovor_C** - Answer option C (empty for open-ended)
7. **Odgovor_D** - Answer option D (empty for open-ended)
8. **Tocan_odgovor** - Correct answer:
   - For multiple choice: Letter (A, B, C, or D)
   - For open-ended: Full text answer
9. **Napomena** - Optional note/explanation

## Example: Multiple Choice Question

```tsv
PNI	Koliko igrača ima svaka momčad na terenu?	visestruki_izbor	10 igrača	11 igrača	12 igrača	9 igrača	B
```

## Example: Open-Ended Question

```tsv
PNI	Navedite tri osnovna principa didaktike sporta.	otvoreno				Princip postupnosti, princip sistematičnosti, princip individualizacije	Ovo je opcionalno objašnjenje
```

## Adding New Questions

1. Create or edit the appropriate TSV file
2. Ensure the first row is the header
3. Add questions as new rows
4. Use tabs (	) as separators between columns
5. Leave empty fields blank (just tabs between columns)
6. Save the file and refresh the app

Questions will be automatically loaded and assigned unique IDs.

## Converting from CSV/Excel to TSV

If you have questions in Excel or CSV format:
1. Open the file in Excel or Google Sheets
2. Export/Save As → Tab-delimited text (.txt or .tsv)
3. Rename the file to follow the naming convention above
4. Place in this directory
