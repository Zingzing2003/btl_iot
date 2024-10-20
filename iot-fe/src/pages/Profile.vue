<script setup lang="ts">

</script>

<template>
  <div class="h-full w-full px-16 flex justify-center">
    <img src="/bg.png" alt="bg" class="absolute object-cover h-[95vh] w-full overflow-hidden right-0 transform -scale-x-100">
    <div class="glassmorphism rounded-2xl shadow-2xl h-1/3 w-1/3 py-6 mt-40">
      <div class="flex text-lg gap-8 justify-center items-center">
        <img src="/avatar.jpg" alt="avatar" class="h-60 w-44 rounded-xl object-cover">
        <div class="flex flex-col gap-3 text-gray-100">
          <p class="text-center font-bold text-3xl mb-2">Thông Tin Cá Nhân</p>
          <p class="font-semibold">Họ và tên: Bùi Thị Dinh</p>
          <p class="font-semibold">Ngày sinh: 20/03/2003</p>
          <p class="font-semibold">Mã sinh viên: B21DCCN228</p>
          <p class="font-semibold">Lớp hành chính: D21CQCN12-B</p>
          <div class="flex text-lg items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f3f4f6">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <a href="https://github.com/Zingzing2003" class="text-gray-100 font-semibold">Github</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.blur-image {
  filter: blur(10px); /* Apply blur effect to the image */
}
</style>
