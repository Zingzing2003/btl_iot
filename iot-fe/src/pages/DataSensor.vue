<script setup lang="ts">
import { da } from 'element-plus/es/locales.mjs';
import { ref } from 'vue'
import { onMounted,watchEffect  } from 'vue';
const humidity = ref<number>()
  const searchBy= ref("all");
const currentPage = ref(1)
const pageSize = ref(15)
const keyword= ref();
const totalPage= ref(1);
let totalAction= ref(2);
const fullTableData = ref([
  { temperature: 30, humidity: 50, light: 100, time: '2021-10-10 10:10:10' },
  { temperature: 31, humidity: 51, light: 101, time: '2021-10-10 10:10:11' },
  { temperature: 32, humidity: 52, light: 102, time: '2021-10-10 10:10:12' },
  { temperature: 33, humidity: 53, light: 103, time: '2021-10-10 10:10:13' },
  { temperature: 34, humidity: 54, light: 104, time: '2021-10-10 10:10:14' },
  { temperature: 35, humidity: 55, light: 105, time: '2021-10-10 10:10:15' },
  { temperature: 36, humidity: 56, light: 106, time: '2021-10-10 10:10:16' },
  { temperature: 37, humidity: 57, light: 107, time: '2021-10-10 10:10:17' },
  { temperature: 38, humidity: 58, light: 108, time: '2021-10-10 10:10:18' },
  { temperature: 39, humidity: 59, light: 109, time: '2021-10-10 10:10:19' },
  { temperature: 40, humidity: 60, light: 110, time: '2021-10-10 10:10:20' },
  { temperature: 41, humidity: 61, light: 111, time: '2021-10-10 10:10:21' },
  { temperature: 42, humidity: 62, light: 112, time: '2021-10-10 10:10:22' },
  { temperature: 43, humidity: 63, light: 113, time: '2021-10-10 10:10:23' },
  { temperature: 44, humidity: 64, light: 114, time: '2021-10-10 10:10:24' },
  { temperature: 45, humidity: 65, light: 115, time: '2021-10-10 10:10:25' },
  { temperature: 46, humidity: 66, light: 116, time: '2021-10-10 10:10:26' },
  { temperature: 47, humidity: 67, light: 117, time: '2021-10-10 10:10:27' },
  { temperature: 48, humidity: 68, light: 118, time: '2021-10-10 10:10:28' },
  { temperature: 49, humidity: 69, light: 119, time: '2021-10-10 10:10:29' },
  { temperature: 50, humidity: 70, light: 120, time: '2021-10-10 10:10:30' },
  { temperature: 51, humidity: 71, light: 121, time: '2021-10-10 10:10:31' },
  { temperature: 52, humidity: 72, light: 122, time: '2021-10-10 10:10:32' },
  { temperature: 53, humidity: 73, light: 123, time: '2021-10-10 10:10:33' },
  { temperature: 54, humidity: 74, light: 124, time: '2021-10-10 10:10:34' },
  { temperature: 55, humidity: 75, light: 125, time: '2021-10-10 10:10:35' },
  { temperature: 56, humidity: 76, light: 126, time: '2021-10-10 10:10:36' },
  { temperature: 57, humidity: 77, light: 127, time: '2021-10-10 10:10:37' },
  { temperature: 58, humidity: 78, light: 128, time: '2021-10-10 10:10:38' },
  { temperature: 59, humidity: 79, light: 129, time: '2021-10-10 10:10:39' },
  { temperature: 60, humidity: 80, light: 130, time: '2021-10-10 10:10:40' },
  { temperature: 61, humidity: 81, light: 131, time: '2021-10-10 10:10:41' },
  { temperature: 62, humidity: 82, light: 132, time: '2021-10-10 10:10:42' },
  { temperature: 63, humidity: 83, light: 133, time: '2021-10-10 10:10:43' },
  { temperature: 64, humidity: 84, light: 134, time: '2021-10-10 10:10:44' },
  { temperature: 65, humidity: 85, light: 135, time: '2021-10-10 10:10:45' },
  { temperature: 66, humidity: 86, light: 136, time: '2021-10-10 10:10:46' },
  { temperature: 67, humidity: 87, light: 137, time: '2021-10-10 10:10:47' },
  { temperature: 68, humidity: 88, light: 138, time: '2021-10-10 10:10:48' },
  { temperature: 69, humidity: 89, light: 139, time: '2021-10-10 10:10:49' },
  { temperature: 70, humidity: 90, light: 140, time: '2021-10-10 10:10:50' },
])

const counter = ref(0);
let tableData = ref(fullTableData.value.slice(0, pageSize.value))

function search() {
  //call api
  console.log(searchBy.value)
  currentPage.value = 1; // Reset lại trang về 1 khi tìm kiếm
  // console.log(pageSize.value);
  // console.log(sensorName.value);
  fetchData(currentPage.value, pageSize.value, searchBy.value, keyword.value);
}

let dataKey= ref(0);
const fetchData = async (page: number, pageSize: number,  searchBy : string, keyword : number) => {
 
 try {
  
   //console.log("page"+ page+ "pageSize"+ pageSize+ "date"+ date+"name"+ sensorName);
   const response = await fetch(`http://localhost:8080/api/get-all-sensors?page=${page}&limit=${pageSize}&searchBy=${searchBy}&keyword=${keyword}`); 
   console.log(`http://localhost:8080/api/get-all-sensors?page=${page}&limit=${pageSize}&searchBy=${searchBy}&keyword=${keyword}`);
   // Thay bằng URL của API
   const responseData = await response.json();
   fullTableData.value= responseData.data.map( item => ({
    temperature: item.Temperature,
    humidity: item.Humidity,
    light : item.Light,
    time: item.TimeSensor// Chuyển đổi định dạng thời gian
   }));
   totalAction.value= responseData.totalResults;

   tableData = ref(fullTableData.value.slice(0, pageSize));
   counter.value++;
   console.log(fullTableData.value);
   dataKey.value++;
   //watchEffect (()=>{})
   //totalPage= ref(responseData.data.tôt)
  
 } catch (error) {
   console.error("Lỗi khi lấy dữ liệu từ API: ", error);
 }
  
};
onMounted(() => {
 let today = new Date().toISOString().split('T')[0]; 
 // Lấy ngày hiện tại
 console.log(new Date().toLocaleDateString());
 fetchData(currentPage.value, pageSize.value, searchBy.value, keyword.value);
});

 const updateTableData=  () =>{
  // const start = (page - 1) * pageSize.value
  // const end = start + pageSize.value
  console.log("cur"+ currentPage.value);
  //tableData.value = filteredData.slice(start, end)
   fetchData(currentPage.value, pageSize.value, searchBy.value, keyword.value);
}

function reset() {
//  call api
}
</script>

<template>
  <div class="h-full w-full px-16 py-5">
    <h1 class="font-bold text-5xl mb-3">Dữ liệu cảm biến</h1>
    <div class="flex items-center space-x-4 mb-5 justify-center">
      <!-- <el-input size="large" v-model="temperature" placeholder="Nhiệt độ (°C)" /> -->
      <label for="pageSize">Kích thước trang:</label>
      <el-select v-model="pageSize" placeholder="Chọn số bản ghi" style="width: 100px;">
        <el-option label="5" :value="5"></el-option>
        <el-option label="10" :value="10"></el-option>
        <el-option label="15" :value="15"></el-option>
        <el-option label="20" :value="20"></el-option>
      </el-select>
      <label for="sensorName"  size="large">Tìm theo:</label>
      <el-select v-model="searchBy" placeholder="Chọn cảm biến" style="width: 150px;">
        <el-option label="All" :value="'all'"></el-option>
        <el-option label="Humidity" :value="'Humidity'"></el-option>
        <el-option label="Temperature" :value="'Temperature'"></el-option>
        <el-option label="Light" :value="'Light'"></el-option>
      </el-select>
      <label for="value"  size="large">Giá trị tìm kiếm:</label>
      <el-input size="large" v-model="keyword" placeholder="Điền thông số"style="width: 250px;" />
      <!-- <el-input size="large" v-model="humidity" placeholder="Độ ẩm (%)" />
      <el-input size="large" v-model="light" placeholder="Độ sáng (lux)" />
      <el-button size="large" type="primary" @click="search">Tìm kiếm</el-button>
      <el-button size="large" type="success" @click="reset">Đặt lại ban đầu</el-button> -->
      <el-button size="large" type="primary" @click="search">Tìm kiếm</el-button>
      <el-button size="large" type="success" @click="reset">Đặt lại ban đầu</el-button>
    </div>
    <div class="mt-5">
      <el-table :data="tableData" stripe style="width: 100%" :key="dataKey" >
        <el-table-column
          type="index"
          label="ID"
          :index="(index) => (currentPage - 1) * pageSize + index + 1"
        />
        <el-table-column prop="temperature" label="Nhiệt độ (°C)" align="center" />
        <el-table-column prop="humidity" label="Độ ẩm (%)" align="center" />
        <el-table-column prop="light" label="Độ sáng (lux)" align="center" />
        <el-table-column prop="time" label="Thời gian" align="center" />
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="totalAction"
        v-model:current-page="currentPage"
        :page-size="pageSize"
        class="fixed bottom-20 right-20"
        @current-change=" updateTableData" />
    </div>
  </div>
</template>

<style scoped>


.el-pagination {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10; /* Đảm bảo thanh phân trang nằm trên các phần tử khác */
}

.el-pagination .el-select {
  margin-left: 10px; /* Khoảng cách giữa thanh phân trang và nút chọn pageSize */
}
.el-select,
.el-date-picker {
  width: 150px;
}

.el-select .el-input__inner,
.el-date-picker .el-input__inner {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  transition: border-color 0.3s;
}
label {
  display: block; /* Giúp label nằm trên các input */
  font-size: 20px;
  font-weight: 450;
  margin-bottom: 8px; /* Khoảng cách giữa label và input */
  color: #333; /* Màu chữ của label */
}


</style>
