<template>
  <div class="w-full h-full bg-gray-100">
    <div class="flex h-full w-full">
      <nav class="flex flex-row w-full justify-center bg-[#4942E4] shadow-xl fixed">
        <RouterLink :to="{name: 'dashboard'}" class="hover:bg-[#050C9C]">
          <div class="flex items-center py-3 px-8">

            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
              <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm200-80v-240H200v240h200Zm80 0h280v-240H480v240ZM200-520h560v-240H200v240Z" />
            </svg>
            <span class="pl-2 font-medium text-white">Dashboard</span>
          </div>

        </RouterLink>
        <RouterLink :to="{name: 'data-sensor'}" class="hover:bg-[#050C9C]">
          <div class="flex items-center py-3 px-10">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
              <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
            </svg>
            <span class="px-2 font-medium text-white">Dữ liệu cảm biến</span>
          </div>
        </RouterLink>

        <RouterLink :to="{name: 'history'}" class="hover:bg-[#050C9C]">
          <div class="flex items-center py-3 px-10 ">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
              <path
                d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
            </svg>
            <span class="px-2 font-medium text-white">Lịch sử bật tắt</span>

          </div>
        </RouterLink>

        <RouterLink :to="{name: 'profile'}" class="hover:bg-[#050C9C] ">
          <div class="flex items-center py-3 px-10">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
              <path
                d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
            </svg>
            <span class="px-2 font-medium text-white">Thông tin cá nhân</span>
          </div>
        </RouterLink>
      </nav>
      <RouterView class="text-3xl mt-12 w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">

</script>


<style scoped>
.active {
  background-color: #050C9C;
}

.profile-active {
  background-color: #050C9C;
  border-radius: 50%;
}
</style>
