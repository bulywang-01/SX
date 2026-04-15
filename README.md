
# 📘 三峽社區棒球隊營運管理系統

## 一、專案簡介
本系統為三峽社區棒球隊之營運管理系統，以 Google Apps Script + Google Sheets 為基礎，
涵蓋報名、球員、出勤、編隊、財務、幹部與教練權限等模組，支援長期營運與擴充。

---
## 二、系統核心設計原則
- 報名資料與正式球員資料分離
- 穩定資料與時間序列資料分離
- 角色（Role）與權限（Permission）分離
- 支援多賽事、多隊伍、多角色關係
- 所有重要資料保留歷史，不硬刪

---
## 三、資料表總覽

registrations | players | attendance | fee_rules | billing | enum | teams | player_team_assignments | events | staff

---
## 四、各資料表說明

### 1. registrations（報名資料表）
**用途**：存放所有報名資料，作為一次性來源，轉為正式球員後不再作為主資料。

主要欄位：
- registration_id：報名編號
- name：球員姓名
- guardian_name / phone / email：監護人資訊
- trial_date：體驗日期
- source_text：招生來源（文字）
- status：PENDING / FINISH / REJECTED

---
### 2. players（正式球員表）
**用途**：系統核心人物表，存放穩定不常變動的球員屬性。

主要欄位：
- player_id：球員編號
- name：姓名
- gender / birthday
- school / grade
- batting_hand / pitching_hand
- height_cm / weight_kg
- level：球員等級（體驗生／見習生／水手／陸戰／特戰）
- status：ACTIVE / INACTIVE
- source_registration_id：來源報名
- joined_date：入隊日期

---
### 3. attendance（出勤紀錄表）
**用途**：記錄球員每次出勤狀態，作為費用計算依據。

主要欄位：
- attendance_id
- player_id
- date
- status：PRESENT / LEAVE / REST
- note

---
### 4. fee_rules（費用規則表）
**用途**：定義出勤、請假、停練等計費規則。

主要欄位：
- rule_id
- type：ATTEND / LEAVE / OTHER
- amount
- description

---
### 5. billing（帳單結算表）
**用途**：存放每位球員每一期的結算結果。

主要欄位：
- billing_id
- player_id
- period
- total_amount
- generated_date
- paid_status：UNPAID / PAID
- paid_date

---
### 6. enum（系統列舉表）
**用途**：統一管理系統選項，例如球員等級、出勤狀態、權限等級。

---
### 7. teams（隊伍表）
**用途**：定義實際存在的隊伍，不直接綁定球員。

---
### 8. player_team_assignments（球員編隊關聯表）
**用途**：支援球員與隊伍多對多關係，因應不同賽事或期間。

主要欄位：
- assignment_id
- player_id
- team_id
- event_id
- tournament
- start_date / end_date
- role

---
### 9. events（賽事／活動表）
**用途**：定義盃賽、聯賽、調查、停練等活動，作為出勤與編隊情境來源。

---
### 10. staff（球隊幹部／教練表）
**用途**：管理幹部、教練與具管理權限之家長，控制資料存取範圍。

主要欄位：
- staff_id
- name / email / phone
- role_type：STAFF / COACH
- role_name：領隊／管理幹部／教練角色
- age_group：U8 / U10 / U12 / U15 / U18
- coach_level：A / B / C
- permission_level：FULL / GROUP / READ_ONLY
- status：ACTIVE / INACTIVE
- linked_player_id：關聯球員（家長身分）
- note
- created_date

---
## 五、資料關聯概念圖
registrations → players → attendance / billing / player_team_assignments → teams → events
staff 依 permission_level 控制可瀏覽資料範圍

---
## 六、建議開發順序
Phase 1：報名轉球員、players 管理、staff 權限
Phase 2：出勤、編隊、賽事
Phase 3：財務結算、報表、公告

---
本文件為系統 v1 設計說明，可作為專案 README.md 使用。
