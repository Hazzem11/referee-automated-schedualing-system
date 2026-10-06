# CSI 4106 Assignment 1 — reference findings

Practice key for **Deep-Sea Mission Data Preparation**. Compare your notebook and `asrc_missions_cleaned.csv` with the decisions and numbers below.

The runnable code, tables, and plots are in `csi4106_a1_reference.ipynb` in this folder. That notebook was executed against the course file:

`https://raw.githubusercontent.com/turcotte/csi4106-f26/main/assignments-data/a1/asrc_missions_raw.csv`

The cleaned table produced by the notebook is `asrc_missions_cleaned.csv`.

This is a self-check, not a Brightspace submission. Put your own name and student number on your own notebook, and complete the AI Use Declaration for any file you upload.

## What “correct” means here

The handout fixes some choices and leaves others to a justified argument. Match the fixed items exactly. Where a choice is open, the note says so.

## 2.1 Load and audit

| Check | Expected |
| --- | --- |
| Shape | 6,371 rows × 17 columns |
| `mission_id` distinct values | 6,371 (one id per row) |
| `deployment_batch` distinct values | 850 |
| `telemetry_protocol` distinct values | 2 |
| `firmware_current` and `mission_interrupted` | integers, 2 values each (0 and 1) |

On a default `read_csv`, these columns stay as text because they contain `?`:

`water_temperature_c`, `sonar_noise_db`, `navigation_drift_m`, `battery_health_pct`, `thruster_vibration_mm_s`, `vehicle_class`, `seabed_terrain`, `maintenance_grade`.

`planned_depth_m`, `planned_depth_ft`, and `descent_current_speed_m_s` load as floats. Default pandas already turns blank fields and `NA` into missing values. It does **not** treat `?` as missing, so the missing counts in this first audit are smaller than the counts in Section 2.2.

## 2.2 Missing values and types

Map empty fields, `NA`, and `?` to missing, then convert numeric-like columns with `to_numeric`. Do not impute.

| Column | Blank | `NA` | `?` | Missing | Percent |
| --- | ---: | ---: | ---: | ---: | ---: |
| `water_temperature_c` | 63 | 44 | 62 | 169 | 2.65% |
| `sonar_noise_db` | 51 | 33 | 39 | 123 | 1.93% |
| `navigation_drift_m` | 57 | 31 | 32 | 120 | 1.88% |
| `battery_health_pct` | 58 | 41 | 48 | 147 | 2.31% |
| `thruster_vibration_mm_s` | 50 | 37 | 39 | 126 | 1.98% |
| `maintenance_grade` | 55 | 39 | 35 | 129 | 2.02% |

No other column has sentinel missing values. Parsing does not add further gaps: those six tokens are the only non-numeric entries.

Battery missingness rises from 147 to 153 later, when six impossible values are removed. Depth and current speed gain 6 missing values each at that same step. If your Section 2.2 table already shows 153 battery gaps, you combined validity cleaning with sentinel cleaning. The sentinel counts above are the ones for this task.

## 2.3 Categorical labels

Clean only repeated text labels. Leave `mission_id`, `deployment_batch`, and `telemetry_protocol` for Section 2.6. Their spellings are already consistent (`asrc_tlm_v3`, `asrc_tlm_v4`).

The inconsistent labels are capitalization, a leading space, or a space/hyphen where the canonical label uses `_`. After strip, case-fold, and replacing spaces and hyphens with `_`:

| Attribute | Levels after cleaning | Order |
| --- | --- | --- |
| `vehicle_class` | `survey` 3,189; `compact` 1,871; `heavy_duty` 1,311 | Nominal |
| `seabed_terrain` | `plain` 2,347; `ridge` 1,794; `trench` 1,245; `vent_field` 985 | Nominal |
| `maintenance_grade` | `poor` 423; `fair` 1,166; `good` 2,522; `excellent` 2,131; missing 129 | Ordered: poor < fair < good < excellent |

Before cleaning, `vehicle_class` has 9 spellings and `seabed_terrain` has 12. `maintenance_grade` has 14 entries if you count the three missing tokens as their own labels.

`maintenance_grade` is the only attribute with a meaningful order. That order is the inspection scale from worst to best.

## 2.4 Validity rules

Replace invalid cells with missing values. Keep the mission row. Do not impute, and do not rebuild a value from another column.

| Attribute | Rule | Invalid rows |
| --- | ---: | ---: |
| `planned_depth_m` | Must be positive and no deeper than 6,500 m | 6 |
| `planned_depth_ft` | Same 6,500 m limit, in feet | 0 |
| `descent_current_speed_m_s` | Speed cannot be negative | 6 |
| `battery_health_pct` | Percentage state of health must be from 0 to 100 | 6 |
| `water_temperature_c` | Outside about −2 °C to 40 °C | 0 |
| `navigation_drift_m` | Distance cannot be negative | 0 |
| `thruster_vibration_mm_s` | RMS vibration cannot be negative | 0 |
| `missions_since_service` | Count cannot be negative | 0 |

Invalid values:

- Depth in metres: 12,300; 19,700; 23,200; 28,700; 33,100; 37,800. All six are beyond the fleet limit and deeper than the ocean.
- Current speed: −1.21, −0.84, −0.43, −0.41, −0.15, −0.06.
- Battery health: 108, six times.

Those six metre values are a tenfold recording error. `planned_depth_ft` equals `round((planned_depth_m / 10) × 3.28084, 1)` on exactly those rows. Leave the metre cell missing anyway. The handout does not allow a correction taken from the foot column.

`sonar_noise_db` has no validity replacement. The observed range, 54.6 dB to 95.0 dB, is a plausible calibration span, and a decibel value can legally sit below its reference.

Keep these extremes. They are unusual and still possible:

| Attribute | Retained min | Retained max |
| --- | ---: | ---: |
| `planned_depth_m` | 280 | 6,290 |
| `descent_current_speed_m_s` | 0.02 | 2.06 |
| `water_temperature_c` | −1.5 | 13.3 |
| `sonar_noise_db` | 54.6 | 95.0 |
| `navigation_drift_m` | 0.8 | 132.2 |
| `battery_health_pct` | 67 | 99 |
| `thruster_vibration_mm_s` | 0.2 | 45 |
| `missions_since_service` | 0 | 55 |

−1.5 °C stays: seawater freezes below 0 °C. 6,290 m stays: it is inside the 6,500 m certification. 45 mm/s and 132.2 m stay: they are rough operating readings, not impossible numbers. A battery health of 67% stays: it is low and still a percentage.

## 2.5 Distributions and relationships

Quantitative attributes for this section are the measurements and counts **before any column is dropped**:

`planned_depth_m`, `planned_depth_ft`, `descent_current_speed_m_s`, `water_temperature_c`, `sonar_noise_db`, `navigation_drift_m`, `battery_health_pct`, `thruster_vibration_mm_s`, `missions_since_service`.

Leave out identifiers, batch and protocol codes, category labels, `firmware_current`, and `mission_interrupted`.

Summary after the validity rules (rounded):

| Attribute | Non-missing | Mean | Std | Min | Q1 | Median | Q3 | Max | Skewness |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `planned_depth_m` | 6,365 | 1,999.93 | 1,402.26 | 280 | 770 | 1,640 | 2,870 | 6,290 | 0.925 |
| `planned_depth_ft` | 6,371 | 6,563.24 | 4,599.60 | 918.6 | 2,559.1 | 5,380.6 | 9,416 | 20,636.5 | 0.924 |
| `descent_current_speed_m_s` | 6,365 | 0.423 | 0.287 | 0.02 | 0.21 | 0.36 | 0.56 | 2.06 | 1.251 |
| `water_temperature_c` | 6,202 | 4.060 | 2.268 | −1.5 | 2.4 | 3.6 | 5.7 | 13.3 | 0.535 |
| `sonar_noise_db` | 6,248 | 72.019 | 6.821 | 54.6 | 66.7 | 72.2 | 77.1 | 95.0 | 0.049 |
| `navigation_drift_m` | 6,251 | 21.753 | 15.810 | 0.8 | 9.8 | 18.0 | 29.3 | 132.2 | 1.483 |
| `battery_health_pct` | 6,218 | 87.952 | 4.271 | 67 | 85 | 88 | 91 | 99 | −0.239 |
| `thruster_vibration_mm_s` | 6,245 | 4.651 | 3.139 | 0.2 | 2.5 | 3.9 | 6.0 | 45 | 2.187 |
| `missions_since_service` | 6,371 | 12.606 | 7.865 | 0 | 7 | 11 | 17 | 55 | 1.108 |

Three shapes worth discussing:

1. **`sonar_noise_db`** is symmetric and unimodal. Mean 72.0 dB, median 72.2 dB, skewness 0.05. The tails are the ends of one peak.
2. **`planned_depth_m`** is unimodal and right-skewed. Mean about 2,000 m, median 1,640 m, tail out to the retained 6,290 m. `planned_depth_ft` has the same shape.
3. **`thruster_vibration_mm_s`** is strongly right-skewed (skewness 2.19), with one peak near a few mm/s and a long tail to 45 mm/s.

`battery_health_pct` is the mild left skew, piled up near 88%.

Pearson heat map on those nine columns only:

- Duplicate pair: `planned_depth_m` with `planned_depth_ft`, **r = 1.00** after the six impossible metre values are missing. On the raw file, before that replacement, the same correlation is only about **0.88**, because the tenfold errors pull it down. Correlation is not the proof of duplication; the residual in Section 2.6 is.
- Strongest non-duplicate: `planned_depth_m` with `water_temperature_c`, **r = −0.73**. Deeper plans, colder descent water. Different concepts, so both stay.
- Other plausible links to mention: depth with sonar noise **+0.66**, temperature with sonar noise **−0.63**, sonar noise with navigation drift **+0.61**, battery health with missions since service **−0.49**.

The reference joint plot is planned depth against descent temperature, coloured by seabed terrain. Mean location of each terrain:

| Terrain | Mean planned depth (m) | Mean descent temperature (°C) |
| --- | ---: | ---: |
| plain | 713 | 6.4 |
| ridge | 1,752 | 3.2 |
| vent_field | 2,759 | 3.1 |
| trench | 4,187 | 1.8 |

The separate histograms do not show these four bands. Plains are shallow and warm, trenches are deep and cold, and vent fields are deeper than ridges at almost the same temperature. Another joint plot is fine if it shows a relationship the histograms hide. A plot that only repeats one histogram does not answer the question.

## 2.6 Columns removed

| Removed | Why | Number to match |
| --- | --- | --- |
| `mission_id` | Unique identifier | 6,371 distinct values in 6,371 rows |
| `deployment_batch` | Administrative code with high cardinality and no mission meaning | 850 codes; most common code appears 8 times (0.13%) |
| `telemetry_protocol` | Quasi-constant (one value on at least 99% of rows) and an administrative protocol code | `asrc_tlm_v4` on 6,318 / 6,371 = **99.17%** of rows; `asrc_tlm_v3` on 53 rows |
| `planned_depth_ft` | Alternate-unit duplicate of `planned_depth_m` | On all **6,365** rows with a valid metre depth, `planned_depth_ft = round(planned_depth_m × 3.28084, 1)` and the residual is **0** |

`3.28084` is `1 / 0.3048` rounded to five decimals. One international foot is exactly 0.3048 m. Metres stay because the 6,500 m limit and the other sensors are metric.

Keeping feet and dropping metres is an acceptable alternate **if** you show this same residual and explain the unit choice. Dropping neither column leaves a duplicate in the file. Dropping both throws away planned depth. Repairing the six metre cells from the foot column, or by dividing by 10, goes against the handout.

Keep these even though they are correlated. They are not copies of each other:

- planned depth and water temperature
- planned depth and sonar noise
- battery health and missions since service
- thruster vibration and missions since service

Keep `firmware_current`. It is binary, so it is outside the histogram section, and it is not quasi-constant: the value 1 is 5,157 / 6,371 = **80.94%**.

## 2.7 Response

| `mission_interrupted` | Count | Proportion |
| --- | ---: | ---: |
| 0, survey completed | 4,295 | 0.6741 (67.41%) |
| 1, returned early | 2,076 | 0.3259 (32.59%) |

Completed missions outnumber interruptions by about 2.07 to 1. The classes are unbalanced, and the minority class is still common. No model is trained.

## 2.8 Analysis-ready file

`asrc_missions_cleaned.csv`, no index column, **6,371 × 13**. Row order matches the source. Missing predictor cells stay missing.

Column order:

1. `planned_depth_m`
2. `descent_current_speed_m_s`
3. `water_temperature_c`
4. `sonar_noise_db`
5. `navigation_drift_m`
6. `battery_health_pct`
7. `thruster_vibration_mm_s`
8. `missions_since_service`
9. `vehicle_class`
10. `seabed_terrain`
11. `maintenance_grade`
12. `firmware_current`
13. `mission_interrupted`

Missing counts in the saved file:

| Column | Missing |
| --- | ---: |
| `planned_depth_m` | 6 |
| `descent_current_speed_m_s` | 6 |
| `water_temperature_c` | 169 |
| `sonar_noise_db` | 123 |
| `navigation_drift_m` | 120 |
| `battery_health_pct` | 153 |
| `thruster_vibration_mm_s` | 126 |
| `maintenance_grade` | 129 |

Checks that should pass on the reloaded file: only the cleaned category labels; no depth above 6,500 m; no negative speed; no battery value above 100; response and `missions_since_service` unchanged in row order; the four removed columns absent.

A CSV cannot store the ordered-category metadata. The file should contain the strings `poor`, `fair`, `good`, and `excellent`, and the order itself belongs in the write-up.

## Where a mismatch usually comes from

- Section 2.2 missing counts that still include the literal `?`, or that already include the six invalid batteries.
- Category tables that still contain `Survey`, `Heavy Duty`, `vent-field`, `RIDGE`, or a leading space.
- Treating `maintenance_grade` as nominal, or inventing an order for terrain or vehicle class.
- Setting the six deep `planned_depth_m` values to `planned_depth_m / 10` instead of missing.
- Dropping the six bad missions instead of only the bad cells.
- Calling −1.5 °C, 2.06 m/s, 45 mm/s, or 132.2 m invalid.
- Calling battery health 108 a valid extreme.
- Leaving `planned_depth_ft` in the cleaned file because the correlation was 0.88 on the raw data. After the six bad metre values are missing, the conversion residual is 0 on every remaining pair.
- Removing `firmware_current`, or keeping `telemetry_protocol` despite the 99.17% share.
- Putting `firmware_current` or `mission_interrupted` on the correlation heat map without a reason.
- Drawing the histograms after the columns have already been dropped, so `planned_depth_ft` never appears.
- Training a classifier. This assignment stops at the cleaned table.
