
# 📘 三峽社區棒球隊營運管理系統（README.md）

---

## 一、專案簡介

本系統為 **三峽社區棒球隊** 之營運管理系統，
以 **Google Apps Script + Google Sheets** 為核心架構，
完整涵蓋以下模組：

- 入隊報名管理
- 正式球員管理
- 出勤與請假管理
- 球員編隊與賽事管理
- 費用規則與帳單結算
- 球隊幹部與教練角色、權限管理

系統設計目標為：**可長期營運、資料可追溯、權限可控、規則可調整**。

---

## 二、系統設計核心理念

- ✅ 報名資料與正式球員資料分離
- ✅ 穩定資料與時間序列資料分離
- ✅ 角色（Role）與權限（Permission）分離
- ✅ 支援多賽事、多隊伍、多角色關係
- ✅ 所有重要資料保留歷史，不硬刪

---

## 三、資料表（Sheets）總覽

目前系統包含以下資料表：

```
registrations
players
attendance
fee_rules
billing
enum
teams
player_team_assignments
events
staff
```

---

## 四、各資料表完整說明

---

## 1️⃣ registrations（報名資料表）

### 中文名稱
**報名資料（報名池）**

### 功能定位

- 儲存所有「尚未處理、已處理或已轉正式球員」的入隊報名資料
- 為建立正式球員（players）的唯一來源
- 為一次性資料，轉入 players 後不再作為營運主資料使用

### 欄位完整對照

| 欄位名稱 | 中文說明 |
|---|---|
| registration_id | 報名編號（系統流水號） |
| status | 處理狀態（PENDING / APPROVED / FINISH / REJECTED） |
| name | 球員姓名 |
| gender | 性別 |
| birthday | 出生年月日 |
| school | 就讀學校 |
| grade | 年級 |
| batting_hand | 打擊慣用手（右 / 左 / 左右） |
| pitching_hand | 投球慣用手（右 / 左 / 左右） |
| height_cm | 身高（公分） |
| weight_kg | 體重（公斤） |
| guardian_name | 監護人姓名 |
| guardian_phone | 監護人聯絡電話 |
| guardian_email | 監護人 Email |
| baseball_level | 棒球接觸程度 |
| other_team_status | 是否曾加入其他球隊 |
| siblings_joined | 是否有兄弟姊妹一同報名 |
| siblings_names | 兄弟姊妹姓名 |
| parent_support | 家長是否願意協助隊務 |
| source_champion | 招生來源：冠軍隊伍（原始值 1 / 空白） |
| source_facebook | 招生來源：FB 官網 |
| source_friend | 招生來源：親友介紹 |
| source_flyer | 招生來源：紙本傳單 |
| source_store | 招生來源：店家廣告單 |
| source_other | 招生來源：其他 |
| source_text | 招生來源（文字彙總，給人閱讀） |
| trial_date | 體驗日期 |
| remark | 備註 |
| created_date | 報名建立時間 |
| processed_date | 處理完成時間 |
| processed_by | 處理人員（staff_id） |

### 狀態說明（status）

```
PENDING    尚未處理
APPROVED   已確認，待轉正式球員
FINISH     ✅ 已建立 players 資料
REJECTED   不錄取 / 放棄
```

### 關聯

- ➜ players（轉為正式球員）
- players.source_registration_id 對應此表

---

## 2️⃣ players（正式球員表）

### 中文名稱
**正式球員基本資料**

### 功能定位

- 系統核心人物資料表
- 存放球員「穩定、不常變動」的屬性

### 主要欄位

| 欄位 | 說明 |
|---|---|
| player_id | 球員編號 |
| name | 球員姓名 |
| gender | 性別 |
| birthday | 出生年月日 |
| school | 就讀學校 |
| grade | 年級 |
| batting_hand | 打擊慣用手 |
| pitching_hand | 投球慣用手 |
| height_cm | 身高 |
| weight_kg | 體重 |
| level | 球員等級（體驗生 / 見習生 / 水手 / 陸戰 / 特戰） |
| status | ACTIVE / INACTIVE |
| source_registration_id | 來源報名編號 |
| joined_date | 入隊日期 |
| left_date | 離隊日期 |

---

## 3️⃣ attendance（出勤紀錄表）

### 中文名稱
**球員出勤紀錄**

### 功能定位

- 記錄每位球員在每次練習或活動的出勤狀態
- 為費用計算與出勤統計的主要來源

### 主要欄位

| 欄位 | 說明 |
|---|---|
| attendance_id | 出勤編號 |
| player_id | 球員編號 |
| date | 日期 |
| status | PRESENT / LEAVE / REST |
| note | 備註 |

---

## 4️⃣ fee_rules（費用規則表）

### 中文名稱
**費用計算規則**

### 功能定位

- 定義出席、請假、停練、調整等計費方式
- 規則可調整，不影響歷史帳單

---

## 5️⃣ billing（帳單結算表）

### 中文名稱
**球員費用結算結果**

### 功能定位

- 儲存每位球員每一期的最終應繳金額
- 作為繳費、公告與對帳依據

### 主要欄位

| 欄位 | 說明 |
|---|---|
| billing_id | 帳單編號 |
| player_id | 球員編號 |
| period | 結算期別（例：2025-05~06） |
| total_amount | 應繳金額 |
| generated_date | 結算產生日期 |
| paid_status | UNPAID / PAID |
| paid_date | 繳費日期 |

---

## 6️⃣ enum（系統列舉表）

### 中文名稱
**系統列舉定義**

### 功能定位

- 統一管理所有選項值
- 提供下拉選單與程式判斷使用

---

## 7️⃣ teams（隊伍表）

### 中文名稱
**隊伍資料**

### 功能定位

- 定義實際存在的隊伍
- 不直接綁定球員

---

## 8️⃣ player_team_assignments（球員編隊關聯表）

### 中文名稱
**球員編隊紀錄**

### 功能定位

- 支援球員與隊伍多對多關係
- 因應不同賽事或活動產生不同編隊結果

---

## 9️⃣ events（賽事／活動表）

### 中文名稱
**賽事與活動定義**

### 功能定位

- 定義盃賽、聯賽、調查、停練等事件
- 作為出勤與編隊情境來源

---

## 🔟 staff（球隊幹部／教練表）

### 中文名稱
**球隊人員與權限管理**

### 功能定位

- 管理幹部、教練與具管理權限之家長
- 控制可瀏覽與操作的資料範圍

---

## 五、資料關聯概念

registrations → players → attendance / billing / player_team_assignments → teams → events
staff 依 permission_level 控制資料可視範圍

---

## 六、建議開發順序

- Phase 1：報名轉球員、players 管理、staff 權限
- Phase 2：出勤、編隊、賽事
- Phase 3：費用結算、財務報表、公告

---

本文件為系統 v1 完整設計說明（README.md）。
