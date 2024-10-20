<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import { computed, ref } from 'vue';
import { onMounted,onBeforeMount

 } from 'vue';
import { fa, tr } from 'element-plus/es/locales.mjs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

let light = ref(100);
let temperature = ref(40);
let humidity = ref(30);

const isLightActive = ref(false);
const isFanActive = ref(false);
const isAirConditionActive = ref(false);
const state= ref();
let check = ref(false);

const lightBg = computed(() => {
  const normalizedLux = Math.min(Math.max(light.value, 0), 1000);
  const lightness = (normalizedLux / 1000) * 100;
  return `hsl(60, 100%, ${lightness}%)`; // Yellow hue (60)
});

const temperatureBg = computed(() => {
  const normalizedTemperature = Math.min(Math.max(temperature.value, 0), 40);
  const hue = normalizedTemperature <= 16 ? 240 : 240 - ((normalizedTemperature - 16) / (40 - 16)) * 240;
  return `hsl(${hue}, 100%, 50%)`;
});

const humidityBg = computed(() => {
  const normalizedHumidity = Math.min(Math.max(humidity.value, 0), 100);
  const lightness = 100 - (normalizedHumidity / 100) * 50;
  return `hsl(240, 100%, ${lightness}%)`; // Blue hue (240)
});

let change= ref(1);
let data = ref({
  labels: [0, 2, 4, 6, 8, 10, 12,14,16,18],
  datasets: [
    {
      label: 'Temperature',
      backgroundColor: temperatureBg.value,
      borderColor: temperatureBg.value,
      data:  [],
    },
    {
      label: 'Humidity',
      backgroundColor: humidityBg.value,
      borderColor: humidityBg.value,
      data: [],
    },
    {
      label: 'Light',
      backgroundColor: lightBg.value,
      borderColor: lightBg.value,
      data: [],
    },
  ],
 
});

// let chartDataKey=  0;
let chartDataKey = ref(0);

const fetchData = async () => {
  
  try {
    console.log("check");
    
    const response = await fetch('http://localhost:8080/api/get-top-sensors'); // Thay bằng URL của API
    const responseData = await response.json();
    console.log(responseData.data);

    // light.value = responseData.light;
    // temperature.value = responseData.temperature;
    // humidity.value = responseData.humidity;

    // Cập nhật dữ liệu biểu đồ với dữ liệu mới
   
    data.value.datasets[0].data = responseData.data.map(item => item.Temperature);
    console.log(data.value.datasets[0].data)
    data.value.datasets[1].data = responseData.data.map(item => item.Humidity);
    data.value.datasets[2].data = responseData.data.map(item => item.Light);
    temperature= data.value.datasets[0].data[0];
    humidity= ref(data.value.datasets[1].data[0]);
    light=  data.value.datasets[2].data[0];

    console.log( data.value.datasets[2].data);
    chartDataKey += 1;
   // change= ref(chartDataKey);
    check.value= !check.value;
   
    // data.value.datasets[0].data = [responseData.temperature, ...data.value.datasets[0].data.slice(0, 6)];
    // data.value.datasets[1].data = [responseData.humidity, ...data.value.datasets[1].data.slice(0, 6)];
    // data.value.datasets[2].data = [responseData.light, ...data.value.datasets[2].data.slice(0, 6)];

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API: ", error);
  }
};

onMounted   (() => {
  fetchData();
 
 //setInterval(fetchData, 2000); // Lấy dữ liệu mỗi 2 giây
});

const OnAirToggle= ()=>{
  isAirConditionActive.value= !isAirConditionActive.value;
  // xử lí
  if( isAirConditionActive.value){
    state.value= "off";
  }
  else{
    state.value= "on";
  }
 
  postData(state.value);
  console.log(state.value);

  isAirConditionActive.value= !isAirConditionActive.value;
  console.log(isAirConditionActive.value);
}

const OnFanToggle= ()=>{
  isFanActive.value= !isFanActive.value;
  // xử lí
  if( isFanActive.value){
    state.value= "off";
  }
  else{
    state.value= "on";
  }
 
  postData(state.value);
  //console.log(state.value);

  isFanActive.value= !isFanActive.value;
 // console.log(isAirConditionActive.value);
}

const postData = async (state: string) => {
 
  console.log("post");
 try {

  
  let response= await fetch(`http://localhost:8080/api/control-air?state=${state}`, {
    method: 'POST'});

    console.log(response.json);

 } catch (error) {
   console.error("Lỗi khi lấy dữ liệu từ API: ", error);
 }
}
const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>


<template>
  <div class="h-full w-full px-16 py-5">
    <h1 class="font-bold text-5xl mb-3">Dashboard</h1>
    <div class="h-[80vh] w-full flex flex-col gap-5 text-white">
      <div class="flex gap-5 h-1/4 w-full text-white">
        <div :style="{ 'background-color': temperatureBg, 'color': temperature < 0 ? 'black' : 'white' }"
             class="bg-gray-500 h-full w-1/3 rounded-2xl flex flex-col gap-2 justify-center items-center">
          <svg :style="{ 'fill': temperature < 40 ? 'black' : 'white' }"
               xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#fff">
            <path
              d="M480-80q-83 0-141.5-58.5T280-280q0-48 21-89.5t59-70.5v-320q0-50 35-85t85-35q50 0 85 35t35 85v320q38 29 59 70.5t21 89.5q0 83-58.5 141.5T480-80Zm-40-440h80v-40h-40v-40h40v-80h-40v-40h40v-40q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240Z" />
          </svg>
          <span class="font-semibold">{{ temperature }}°C</span>
        </div>
        <div :style="{ 'background-color': humidityBg, 'color': humidity < 50 ? 'black' : 'white' }"
             class="bg-gray-500 h-full w-1/3 rounded-2xl flex flex-col gap-2 justify-center items-center">
          <svg :style="{ 'fill': humidity < 50 ? 'black' : 'white' }"
               xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#fff">
            <path
              d="M580.12-250q20.88 0 35.38-14.62 14.5-14.62 14.5-35.5 0-20.88-14.62-35.38-14.62-14.5-35.5-14.5-20.88 0-35.38 14.62-14.5 14.62-14.5 35.5 0 20.88 14.62 35.38 14.62 14.5 35.5 14.5ZM378-256l246-246-42-42-246 246 42 42Zm2.12-194q20.88 0 35.38-14.62 14.5-14.62 14.5-35.5 0-20.88-14.62-35.38-14.62-14.5-35.5-14.5-20.88 0-35.38 14.62-14.5 14.62-14.5 35.5 0 20.88 14.62 35.38 14.62 14.5 35.5 14.5ZM480-80q-137 0-228.5-94T160-408q0-100 79.5-217.5T480-880q161 137 240.5 254.5T800-408q0 140-91.5 234T480-80Zm0-60q112 0 186-76.5t74-191.82q0-78.68-66.5-179.18T480-800Q353-688 286.5-587.5T220-408.32Q220-293 294-216.5T480-140Zm0-340Z" />
          </svg>
          <span class="font-semibold">{{ humidity }}%</span>
        </div>
        <div :style="{ 'background-color': lightBg, 'color': light > 400 ? 'black' : 'white' }"
             class="h-full w-1/3 rounded-2xl flex flex-col gap-2 justify-center items-center">
          <svg :style="{ 'fill': light > 400 ? 'black' : 'white' }"
               xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#fff">
            <path
              d="M480-340q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41Zm0 60q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-450H40v-60h160v60Zm720 0H760v-60h160v60ZM450-760v-160h60v160h-60Zm0 720v-160h60v160h-60ZM262-658l-100-97 43-44 96 100-39 41Zm494 496-98-100 41-41 99 98-42 43Zm-99-537 98-99 44 42-99 98-43-41ZM162-205l99-98 42 42-98 99-43-43Zm318-275Z" />
          </svg>
          <span class="font-semibold">{{ light }} lux</span>
        </div>
      </div>
      <div class="flex h-3/4 w-full gap-5">
        <div class="h-full w-2/3 shadow-2xl rounded-3xl p-5 bg-white">
          <!-- <Line :data="data.value" :options="options" :key="chartDataKey.value" /> -->
           <Line :data="data" :options="options" :key="chartDataKey" /> 
        </div>

        <div class="h-full w-1/3 flex flex-col gap-5">
          <div class="bg-blue-500 h-1/3 w-full rounded-2xl flex flex-col gap-2 justify-center items-center">
            <div class="text-xl">
             
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#fff">
              <path
                d="M480-80q-27 0-47.5-13T406-129h-14q-24 0-42-18t-18-42v-143q-66-43-104-110t-38-148q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 81-38 148T628-332v143q0 24-18 42t-42 18h-14q-6 23-26.5 36T480-80Zm-88-109h176v-44H392v44Zm0-84h176v-40H392v40Zm-9-100h74v-137l-92-92 31-31 84 84 84-84 31 31-92 92v137h74q60-28 96.5-87T710-590q0-97-66.5-163.5T480-820q-97 0-163.5 66.5T250-590q0 71 36.5 130t96.5 87Zm97-176Zm0-48Z" />
            </svg>
            <el-switch v-model="isLightActive" />
          </div>
          <div class="bg-blue-500 h-1/3 w-full rounded-2xl flex flex-col gap-2 justify-center items-center">
            <div class="text-xl">
          
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#fff">
              <path
                d="M424-80q-51 0-77.5-30.5T320-180q0-26 11.5-50.5T367-271q22-14 36.5-37.5T425-373q-1 0-1-.5t-2-1.5l-116 41q-17 6-33 10t-33 4q-63 0-111.5-55T80-536q0-51 30.5-77.5T179-640q26 0 51 11.5t41 35.5q14 22 39.5 37.5T373-535q.67-1 1.33-2 .67-1 .67-2l-41-115q-6-17-10-33t-4-32q0-64 55-112.5T536-880q51 0 77.5 30.5T640-781q0 26-11.5 51T593-689q-26 17-40.5 45T536-586q1 1 1.5.5t1.5 1.5l115-43q17-6 32.5-9.5T719-640q81 0 121 67t40 149q0 51-32 77.5T777-320q-25 0-48.5-11.5T689-367q-14-22-37.5-36.5T587-426q-1 2-1.6 3.06-.6 1.06-1.4 1.94l42 115q6 16 10 30.5t4 30.5q1 65-54 115T424-80Zm56-340q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420Zm-58-165q12-5 26-9t28-6q8-45 29.5-81t54.5-58q10-7 15-17.5t5-24.5q0-16.42-10.5-27.71T536-820q-43 0-98.5 20.55-55.5 20.54-57.5 80.32 0 11.21 2.5 21.17T388-680l34 95ZM240-380q14 0 40-8l95-34q-8-14-11.5-28t-3.5-26q-45-8-81-29.5T221-560q-7-10-19-15t-23-5q-19 0-29 10.5T140-536q0 61.94 25.63 108.97Q191.25-380 240-380Zm184 240q53.13 0 104.57-23Q580-186 580-242q0-11-2-19t-6-19l-34-95q-13 6-26.5 10t-27.5 5q-8 45-29.5 81T400-221q-9 6-14.5 18.5T380-179q1 15 11 27t33 12Zm353-240q16.83 0 29.91-9.17Q820-398.33 820-424q0-44-20.5-99t-81.33-57q-11.17 0-20.67 2-9.5 2-17.5 5l-95 35q5 8 10 25.5t5 28.5q45 8 81 29.5t58 54.5q6 8 16.67 14 10.66 6 21.33 6ZM600-484ZM476-600ZM360-476Zm124 116Z" />
            </svg>
            <el-switch v-model="isFanActive"/>
          </div>
          <div class="text-xl font-semibold text-black">Điều hòa không khí</div>
          <div class="bg-blue-500 h-1/3 w-full rounded-2xl flex flex-col gap-2 justify-center items-center">
            <div class="text-xl">
             Bật/Tắt
           </div>
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#fff">
              <path
                d="M480-240q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm-20-61v-131l-92 92q20 17 43 27t49 12Zm40 0q26-3 49-13.5t43-25.5l-92-92v131Zm120-67q16-20 27-43t13-49H528l92 92Zm-92-132h131q-2-26-12-49t-27-43l-92 92Zm-28-28 92-92q-20-16-43-26.5T500-659v131Zm-19.82 78q12.82 0 21.32-8.68 8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5ZM460-528v-131q-26 1-49 11.5T368-620l92 92Zm-159 28h131l-92-92q-16 20-26.5 43T301-500Zm39 132 92-92H301q3 26 13 49t26 43ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z" />
            </svg>
            
           <el-switch v-model="isAirConditionActive" @change="OnAirToggle" />
          
      
          </div>
        </div> 

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
