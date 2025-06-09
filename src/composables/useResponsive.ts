import { ref, onMounted, onUnmounted } from "vue";

// 断点配置，可根据需要扩展
const breakpoints = {
  mobile: 0,
  tablet: 500,
  laptop: 1000,
  desktop: 1400,
  wide: 1800,
};

export function useResponsive() {
  const width = ref(window.innerWidth);

  // 响应式参数
  const itemsPerRow = ref(getItemsPerRow(width.value));
  const maxProjectsPerBlock = ref(getMaxProjectsPerBlock(width.value));
  const fontSize = ref(getFontSize(width.value));

  function getItemsPerRow(w: number) {
    if (w >= breakpoints.laptop) return 3;
    if (w >= breakpoints.tablet) return 2;
    return 1;
  }

  function getMaxProjectsPerBlock(w: number) {
    if (w >= breakpoints.desktop) return 6;
    if (w >= breakpoints.laptop) return 5;
    if (w >= breakpoints.tablet) return 5;
    return 4;
  }

  function getFontSize(w: number) {
    if (w >= breakpoints.wide) return "20px";
    if (w >= breakpoints.desktop) return "18px";
    if (w >= breakpoints.laptop) return "16px";
    if (w >= breakpoints.tablet) return "15px";
    return "14px";
  }

  function handleResize() {
    width.value = window.innerWidth;
    itemsPerRow.value = getItemsPerRow(width.value);
    maxProjectsPerBlock.value = getMaxProjectsPerBlock(width.value);
    fontSize.value = getFontSize(width.value);
  }

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return {
    width,
    itemsPerRow,
    maxProjectsPerBlock,
    fontSize,
    breakpoints,
  };
}
