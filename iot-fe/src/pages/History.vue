<script setup lang="ts">
import { time } from 'console';
import { nextTick } from 'vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
const currentPage = ref(1)
const pageSize = ref(15)
const Device= ref("all");
let totalAction= ref(2);
const selectedDate = ref(new Date("06/10/2024")) // Ngày được chọn, mặc định là ngày hiện tại
const fullTableData = ref([
  { device: 'Đèn', status: 'On', time: '2023-08-25 10:00:00' },
  { device: 'Điều hoà', status: 'Off', time: '2023-08-25 10:05:00' },
  { device: 'Quạt', status: 'On', time: '2023-08-25 10:10:00' },
  { device: 'Đèn', status: 'Off', time: '2023-08-25 10:15:00' },
  { device: 'Điều hoà', status: 'On', time: '2023-08-25 10:20:00' },
  { device: 'Quạt', status: 'Off', time: '2023-08-25 10:25:00' },
  { device: 'Đèn', status: 'On', time: '2023-08-25 10:30:00' },
  { device: 'Điều hoà', status: 'Off', time: '2023-08-25 10:35:00' },
  { device: 'Quạt', status: 'On', time: '2023-08-25 10:40:00' },
  { device: 'Đèn', status: 'Off', time: '2023-08-25 10:45:00' },
  { device: 'Điều hoà', status: 'On', time: '2023-08-25 10:50:00' },
  { device: 'Quạt', status: 'Off', time: '2023-08-25 10:55:00' },
  { device: 'Đèn', status: 'On', time: '2023-08-25 11:00:00' },
  { device: 'Điều hoà', status: 'Off', time: '2023-08-25 11:05:00' },
  { device: 'Quạt', status: 'On', time: '2023-08-25 11:10:00' },
  { device: 'Đèn', status: 'Off', time: '2023-08-25 11:15:00' },
  { device: 'Điều hoà', status: 'On', time: '2023-08-25 11:20:00' },
  { device: 'Quạt', status: 'Off', time: '2023-08-25 11:25:00' },
  { device: 'Đèn', status: 'On', time: '2023-08-25 11:30:00' },
  { device: 'Điều hoà', status: 'Off', time: '2023-08-25 11:35:00' },
  { device: 'Quạt', status: 'On', time: '2023-08-25 11:40:00' },
  { device: 'Đèn', status: 'Off', time: '2023-08-25 11:45:00' },
  { device: 'Điều hoà', status: 'On', time: '2023-08-25 11:50:00' },
  { device: 'Quạt', status: 'Off', time: '2023-08-25 11:55:00' },
  { device: 'Đèn', status: 'On', time: '2023-08-25 12:00:00' },
  { device: 'Điều hoà', status: 'Off', time: '2023-08-25 12:05:00' },
  { device: 'Quạt', status: 'On', time: '2023-08-25 12:10:00' },
  { device: 'Đèn', status: 'Off', time: '2023-08-25 12:15:00' },
  { device: 'Điều hoà', status: 'On', time: '2023-08-25 12:20:00' },
  { device: 'Quạt', status: 'Off', time: '2023-08-25 12:25:00' },
])

const tableRowClassName = ({ row, rowIndex }: {
  row: object, rowIndex: number
}) => {
  if (row.device === 'Đèn') {
    return 'light'
  }
  if (row.device === 'Điều hoà') {
    return 'air'
  }
  if (row.device === 'Quạt') {
    return 'fan'
  }
  return ''
}
let dataKey= ref(0);

const fetchData = async (page: number, pageSize: number, date: string, Device : string) => {
 
  try {
   
    console.log("page"+ page+ "pageSize"+ pageSize+ "date"+ date+"name"+ Device);
    const response = await fetch(`http://localhost:8080/api/get-history-action?page=${page}&limit=${pageSize}&date=${date}&Device=${Device}`); 
    console.log(`http://localhost:8080/api/get-history-action?page=${page}&limit=${pageSize}&date=${date}&Device=${Device}`)// Thay bằng URL của API
    const responseData = await response.json();
    fullTableData.value= responseData.data.map(item => ({
        device: item.Device,
        status: item.Action,
        time: item.TimeAction// Chuyển đổi định dạng thời gian
    }));
    
    tableData = ref(fullTableData.value.slice(0, pageSize.value))
    totalAction.value= responseData.totalActions;
    console.log("t", totalAction.value)
    dataKey.value++;

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API: ", error);
  }
   nextTick(() => {
        console.log("DOM đã được cập nhật");
    });
};
onMounted(() => {
  let today = new Date().toISOString().split('T')[0]; 
  // Lấy ngày hiện tại
  console.log(new Date().toLocaleDateString());
  fetchData(currentPage.value, pageSize.value, "06/10/2024", Device.value);
});



let tableData = ref(fullTableData.value.slice(0, pageSize.value))

function updateTableData(filteredData = fullTableData.value, page = currentPage.value) {
  const start = (page - 1) * pageSize.value
  const end = start + pageSize.value
  fetchData(currentPage.value, pageSize.value,selectedDate.value, Device.value);

 // tableData.value = filteredData.slice(start, end)
}

const handleSearch = () => {
  currentPage.value = 1; // Reset lại trang về 1 khi tìm kiếm
  console.log(pageSize.value);
  console.log(Device.value);
  fetchData(currentPage.value, pageSize.value,selectedDate.value, Device.value);
};

</script>
<template>
  <div class="h-full w-full px-16 py-5">
    <h1 class="font-bold text-5xl mb-3">Lịch sử bật tắt</h1>
    
    <!-- Thêm phần tìm kiếm và chọn pageSize -->
    <div class="flex items-center space-x-4 mb-5  justify-center">
      <label for="pageSize">Số bản ghi mỗi trang:</label>
      <el-select v-model="pageSize" placeholder="Chọn số bản ghi" style="width: 120px;">
        <el-option label="5" :value="5"></el-option>
        <el-option label="10" :value="10"></el-option>
        <el-option label="15" :value="15"></el-option>
        <el-option label="20" :value="20"></el-option>
      </el-select>
      <label for="Decice">Tên thiết bị:</label>
      <el-select v-model="Device" placeholder="Chọn cảm biến" style="width: 120px;">
        <el-option label="All" :value="'all'"></el-option>
        <el-option label="Air" :value="'Air'"></el-option>
        <el-option label="Led" :value="'Led'"></el-option>
        <el-option label="Fan" :value="'Fan'"></el-option>
      </el-select>
      <label for="date">Chọn ngày:</label>
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="Chọn ngày"
        format="DD/MM/YYYY"
        value-format="DD/MM/YYYY"
      ></el-date-picker>

      <el-button type="primary" @click="handleSearch">Tìm kiếm</el-button>
    </div>

    <div class="mt-5">
      <el-table :data="tableData" stripe style="width: 100%" :row-class-name="tableRowClassName" :key="dataKey">
        <el-table-column
          type="index"
          label="ID"
          :index="(index) => (currentPage - 1) * pageSize + index + 1"
        />
        <el-table-column prop="device" label="Tên thiết bị" align="center" />
        <el-table-column prop="status" label="Trạng thái" align="center" />
        <el-table-column prop="time" label="Thời gian" align="center" />
      </el-table>

      <el-pagination
        layout="prev, pager, next"
        :total="totalAction"
        v-model:current-page="currentPage"
        :page-size="pageSize"
        class="fixed bottom-20 right-20"
        @current-change="(page) => updateTableData(fullTableData.value, page)"  />
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
label {
  
  display: block; /* Giúp label nằm trên các input */
  font-size: 20px;
  font-weight: 450;
  margin-bottom: 8px; /* Khoảng cách giữa label và input */
  color: #333; /* Màu chữ của label */
}

.el-table .fan {
  background-color: #f87979;
}

.el-table .light {
  background-color: #79f879;
}

.el-table .air {
  background-color: #7979f8;
}
.form-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

/* Các trường input và select */
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

/* Khi hover vào các trường */
.el-select:hover .el-input__inner,
.el-date-picker:hover .el-input__inner {
  border-color: #409eff;
}

/* Nút tìm kiếm */
.el-button {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 6px;
  background-color: #409eff;
  color: white;
  box-shadow: 0px 4px 8px rgba(64, 158, 255, 0.3);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.el-button:hover {
  background-color: #66b1ff;
  box-shadow: 0px 6px 12px rgba(64, 158, 255, 0.4);
}
</style>
