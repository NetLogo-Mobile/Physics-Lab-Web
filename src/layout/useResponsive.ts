import { ref, onMounted, onUnmounted } from "vue";

const breakpoints = {
  mobile: 0,
  tablet: 500,
  laptop: 1000,
  desktop: 1400,
  wide: 1800,
};

/**
 * 依据当前窗口宽度计算响应式布局参数
 * A composable function that provides responsive layout values (ref) based on the current window width.
 *
 * @returns {Object} 会在响应式变化时自动更新的响应式布局参数对象。Reactive references automatically update when the window is resized.
 *
 * @example
 * ```typescript
 * const { width, blockItemsPerRow, maxProjectsPerBlock, fontSize } = useResponsive();
 * ```
 * ```vue
 * <My :param="fontsize"></My>
 * ```
 */
export function useResponsive() {
  const width = ref(window.innerWidth);

  const blockItemsPerRow = ref(getBlockItemsPerRow(width.value));
  const maxProjectsPerBlock = ref(getMaxProjectsPerLine(width.value));
  const fontSize = ref(getFontSize(width.value));
  const friendItemsPerRow = ref(getFriendItemsPerRow(width.value))

  // 首页等展示的盒子数量 
  // The number of boxes displayed on the homepage 
  function getBlockItemsPerRow(w: number) {
    if (w >= breakpoints.wide) return 4;
    if (w >= breakpoints.laptop) return 3;
    if (w >= breakpoints.tablet) return 2;
    return 1;
  }

  // 好友界面展示的盒子数量 
  // The number of boxes displayed on the friends.vue 
  function getFriendItemsPerRow(w:number){
    if (w >= breakpoints.wide) return 5;
    if (w >= breakpoints.desktop) return 4;
    if (w >= breakpoints.laptop) return 3;
    return 2;
  }

  //  WorkList界面每行的作品盒子数量
  // The number of work boxes per line in the WorkList page
  function getMaxProjectsPerLine(w: number) {
    if (w >= breakpoints.desktop) return 6;
    if (w >= breakpoints.laptop) return 5;
    if (w >= breakpoints.tablet) return 4;
    if (w >= breakpoints.mobile) return 3;
    return 2;
  }

  // ExperimentSummary字体大小
  // The font size of the ExperimentSummary
  function getFontSize(w: number) {
    if (w >= breakpoints.wide) return "20px";
    if (w >= breakpoints.desktop) return "18px";
    if (w >= breakpoints.laptop) return "16px";
    if (w >= breakpoints.tablet) return "15px";
    return "14px";
  }

  function handleResize() {
    width.value = window.innerWidth;
    blockItemsPerRow.value = getBlockItemsPerRow(width.value);
    maxProjectsPerBlock.value = getMaxProjectsPerLine(width.value);
    fontSize.value = getFontSize(width.value);
    friendItemsPerRow.value = getFriendItemsPerRow(width.value)
  }

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return {
    width,
    blockItemsPerRow,
    friendItemsPerRow,
    maxProjectsPerBlock,
    fontSize,
    breakpoints,
  };
}
