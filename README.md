CrawlerBlockEditor
==================

Cross-Browser Crawler Block Editor

使用方法：
http://kangoextensions.com/docs/general/creating-and-building-browser-extensions.html

Screenshot
=============

Chrome
![Image](../master/screenshot/0.3.1.PNG?raw=true)

Firefox
![Image](../master/screenshot/0.7.0 fox.PNG?raw=true)

Options
![Image](../master/screenshot/0.7.1.PNG?raw=true)


TODO
=============
* 新增防呆 (包含子欄位)。 
* 取共同父節點，父與子的限制。
* json 結果預覽。
* regex 測試使用 API 處理。

Update
=============
v0.24.2
* 增加合併表示式功能。

v0.24.1
* 修復null URL 的 Bug。

v0.24.0
* 自行擷取URLs (判斷Regex 時 不再依賴後台擷取網頁的URL)
* 擷取CSS path 時同時擷取 sample


v0.23.0
* 新增正規式群組結合(請勾選Checkbox 後按右下角的確定)。
* Resources 修正

v0.22.1
* 修正連結測試的bug。

v0.22.0
* 自動生成正規表示式功能上線。

v0.21.4
* 修正某些網站無法顯示CSS node graph 的bug。
* 現在server 若無回應，會跳出警告訊息提示。
* 登入功能上線。
* 修正若干bugs。

v0.20.0
* 增加正規表示式後處理器。

v0.19.0
* CSS選擇器

v0.18.0
* 雙層區塊

    "update_path_url": "http://140.116.245.222:8080/extensions/",

v0.17.0
* 新增區塊編號選擇(從0開始算)。
* field 新增欄位index。
* 案檢視時，網頁上對應的區塊會被highlight。

v0.16.0
* 新增爬行、目標測試。
* 新增區塊測試。


v0.15.0
* 新增排序功能(使用滑鼠拖曳某列區塊的空白處即可排序)。
* 新增區塊和選取區塊流程改良：現在新增區塊會直接新增一個欄位(不會進入選取畫面)，選取區塊即是之前的流程。
* 可以重新選取區塊路徑。


v0.14.0
* 新增自訂預設名稱。


v0.13.1
* 修正若干ｂｕｇ。
 

v0.13.0 (測試版)
* 新增彈出視窗，現在popup 可以顯示在不同視窗 (請按獨立畫面按鈕)。
* 增加顯示/ 隱藏 區塊按紐，現在要顯示全部highlight 要手動按。

v0.12.2
* Field name 必填的提示更加清楚。

v0.12.1
* 修正一個小bug，現在空白名稱的錯誤訊息應該會正確顯示出來。

v0.12.0
* 修正field 的名稱限制 (包含 空字串 和 底線開頭，皆為錯誤)。
* regex 判斷 可用以下的測試錯誤與否 (以js 過不了為準)。
/^((?:(?:[^?+*{}()[\]\\|]+|\\.|\[(?:\^?\\.|\^[^\\]|[^\\^])
* highlight 改成背景顏色會一起變。


v0.11.1
* 修正bug，微調顯示設定。


v0.11.0
* 新增確定取消的按鈕。
* 修正新增任務馬上取消的bug。

v0.10.0

編輯頁面
* 增加流程提示 (浪費空間，但比較清楚，你們或客戶不喜歡我再移除)。
* 新增自動填入標題 和 網址的功能。
* 對於無法匹配到目標網頁的情況給予警告 (考慮是不是在無法匹配時，隱藏"新增區塊"的按鈕)。此功能是我直接使用javascript 的RegExp，所以不保證100% 跟 python 的行為一樣，但若未來奕樵開放API 給我，則可以改進。

資訊頁面
* 新增開啟起始頁面的按鈕。
* 新增隱藏/顯示設定的按鈕。
* 區塊會顯示名稱，若沒有名稱則顯示編號。
* 移除顯示baseURL，user 應該不需要這項資訊。

v0.9.0
* 重製UI介面。

v0.8.0
* 新增確定/取消 按鈕。
* 使用者選取區塊後，可以先預覽是不是他要的區塊。

v0.7.6
* 美化外觀。

v0.7.6
* 美化外觀。


v0.7.4
* 新增自動更新功能，此後的更新只需要按"立即更新擴充功能"即可更新。

v0.7.3
* 修正bug，baseURL 現在會正確判斷。
* 修正bug，task name 不能以"_"開頭，現在會跳出警告。
* 修正bug，server輸入錯誤的話，開啟編輯畫面時會跳出警告，並引導使用者進入選項頁面。


v0.7.2
* 修正若干bug，增加settings，可以方便的和option整合。


v0.7.1
* 新增Options 頁面。
* 目前可以使用的欄位包含server(連接亦樵的網址)、default color(block 的color)、和offline mode (可以不用網路和亦樵那邊的server，主要是測試用的)


v0.7.0
* 修正若干Bug，確定Firefox 可以運行。


v0.6.0
* 跨瀏覽器，主流的瀏覽器都可以用。

v0.5.0
* 修正若干bugs。
* 增加開始工作的按鈕。

v0.4.0
* CURD 實作
* 移除井字號之前的path

v0.3.2
* 現在關於網頁區塊的高量顯示，只會在popup視窗出現時顯示，並隨popup視窗關閉時消失。


v0.3.1
* 更新一下介面和screenshot


v0.3.0
* 所有task 和pattern 之間的連結。
* 新增pattern 欄位，包含source、text、html和link　（其他包含顏色之類的）
* 區塊顏色修改。
* 所有編輯的區塊設定和儲存實作。
* 編輯目前選取的pattern (編輯與移除的功能)

![Image](../master/screenshot/0.3.0.PNG?raw=true)



舊的版本
-------------
v0.2.0
* task 新增、刪除、修改之實裝。
* 新增暫時本地儲存之功能(等待server 端儲存 的過度功能)。
* 介面修改。
* 自動儲存功能(有任何編輯會自動儲存)。


v0.1.5
* 重新架構task 清單。
* 更新部分註解。


v0.1.4
* popup介面再改版。

![Image](../master/screenshot/0.1.4.PNG?raw=true)

v0.1.3
* 完善 "新增pattern" 的流程，並增加取消的按鈕。
* 現在每次要新增一個pattern，都一再按一次"新增區塊"。
* 修正按到超連結會跳掉的bug。



v0.1.2
* 改善popup介面，增加pattern 的欄位。
* v 代表是否將highlight顯示在畫面上。
* c 代表顯示highlight 的顏色 (目前一律是紅色，未來可選)。
* pattern name和 pattern 未來希望改成可編輯的模式。

![Image](../master/screenshot/0.1.2.PNG?raw=true)

v0.1.1
* 修正選取畫面，現在只有被選取到的element會被標記起來。
* popup.html 的區塊會正確顯示已加入的路徑，點擊可切換是否預覽該路徑。


v0.1.0
* 新增popup.html/js -- 按下chrome 畫面上的按鈕後會跳出的頁面。
* 新增backgound.html/js -- 常駐的背景邏輯頁面。
* 新增inject.js -- 要注入剛前網頁的邏輯。
(這版要測試的話請只按一次'新增區塊'就好，之後游標在網頁上活動時，區塊會有變化)
(有問題的話需重新整理頁面)

左上角會有標示你目前選擇的path。




