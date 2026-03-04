// 初始化 ECharts 实例
var historyChart = echarts.init(document.getElementById('history-chart'));

// 定义配色 (与 CSS 变量一致)
const colors = {
    dark: '#4A585E',
    main: '#6B7C82',
    light: '#94A3A8',
    accent: '#BFA696', // 枯茶色点缀
    red: '#B03030'     // 印章红
};

// 模拟历史数据 (实际项目中可从 JSON 加载)
// 注意：这里的 graphic 元素对应 MasterGo 导出的 SVG 路径或图片 URL
const historyData = [
    {
        year: '汉代',
        title: '博山初起·海错通神',
        desc: '香料多来自海外，博山炉盛行。制香以草本为主，追求通神敬天。',
        scent: '熏陆香、沉香',
        imgPath: 'path/to/mastergo-han-censer.svg', // 替换为你的 MasterGo 导出链接
        feature: ['海路通商', '博山炉', '草本合香']
    },
    {
        year: '唐代',
        title: '金粟如来·香囊盈袖',
        desc: '香事进入贵族生活，出现香丸、香球。工艺精细，金银器与香具结合。',
        scent: '檀香、龙脑、丁香',
        imgPath: 'path/to/mastergo-tang-sachet.svg',
        feature: ['香丸成型', '金银香具', '宫廷用香']
    },
    {
        year: '宋代',
        title: '文人雅集·篆香时光',
        desc: '制香技艺巅峰，出现“香谱”。文人亲自调香，追求意境，篆香流行。',
        scent: '鹅梨帐中香、二苏旧局',
        imgPath: 'path/to-mastergo-song-seal.svg',
        feature: ['香谱问世', '文人调香', '篆香技艺']
    },
    {
        year: '明代',
        title: '宣德炉暖·香药同源',
        desc: '宣德炉问世，铜铸香具达到顶峰。制香更重药理，香药同源理念普及。',
        scent: '芽庄沉、惠安沉',
        imgPath: 'path/to/mastergo-ming-censer.svg',
        feature: ['宣德炉', '香药结合', '品类丰富']
    },
    {
        year: '清代',
        title: '宫闱秘制·百香争艳',
        desc: '宫廷用香极尽奢华，合香配方复杂。民间香铺林立，香文化普及。',
        scent: '玫瑰香、茉莉香',
        imgPath: 'path/to/mastergo-qing-bottle.svg',
        feature: ['宫廷秘制', '花香运用', '香铺林立']
    }
];

// 构建 ECharts 选项
const option = {
    backgroundColor: 'transparent', // 使用 CSS 的背景
    tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(242, 244, 245, 0.9)',
        borderColor: colors.main,
        textStyle: { color: colors.dark },
        formatter: function (params) {
            const data = historyData[params[0].dataIndex];
            return `<strong style="color:${colors.dark}; font-family:'Kaiti SC'">${data.year} · ${data.title}</strong><br/>
                    <span style="color:${colors.main}">${data.desc}</span>`;
        }
    },
    // 时间轴组件配置
    timeline: {
        axisType: 'category',
        bottom: '5%',
        left: '5%',
        right: '5%',
        height: 50,
        autoPlay: true,
        playInterval: 3000,
        loop: true,
        label: {
            color: colors.light,
            fontFamily: 'Kaiti SC',
            fontSize: 14,
            formatter: '{value}'
        },
        lineStyle: {
            color: colors.light,
            width: 1,
            type: 'dashed' // 虚线模拟雨丝
        },
        checkpointStyle: {
            color: colors.red, // 当前选中的点是红色印章感
            borderColor: colors.red,
            borderWidth: 2,
            symbol: 'circle',
            symbolSize: 10
        },
        controlStyle: {
            show: true,
            color: colors.main,
            borderColor: colors.main,
            itemSize: 15,
            itemGap: 20
        },
        data: historyData.map(item => item.year)
    },
    // 基础配置 (所有时间点共用的部分)
    baseOption: {
        grid: {
            top: '15%',
            left: '10%',
            right: '10%',
            bottom: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            show: false // 隐藏默认 X 轴，用自定义文本代替
        },
        yAxis: {
            type: 'value',
            show: false,
            min: 0,
            max: 100
        },
        // 使用 custom series 来绘制复杂的图文布局
        series: [{
            type: 'custom',
            renderItem: function (params, api) {
                const index = params.dataIndex;
                const data = historyData[index];
                
                // 获取容器宽高
                const width = api.getWidth();
                const height = api.getHeight();
                
                // 坐标转换 (这里只是示意，实际布局可用 absolute 定位更灵活，
                // 但为了响应式，我们利用 API 计算位置)
                // 为了简化，我们直接返回一个 group，包含文本和图片占位
                // 注意：ECharts 的 custom series 主要用于绘图，复杂的图文混排
                // 最佳实践是结合 HTML/CSS 覆盖层，或者使用 ECharts 的 graphic 组件
                
                // 这里演示用 graphic 组件动态更新的方式（见下文 options 配置）
                return null; 
            },
            data: [0] // 占位数据
        }]
    },
    // 每个时间点的专属配置 (动态切换的部分)
    options: historyData.map((item, index) => ({
        title: {
            text: item.year,
            subtext: item.title,
            left: 'center',
            top: '10%',
            textStyle: {
                color: colors.dark,
                fontFamily: 'Kaiti SC',
                fontSize: 32,
                letterSpacing: 5
            },
            subtextStyle: {
                color: colors.main,
                fontFamily: 'Songti SC',
                fontSize: 18,
                padding: [10, 0, 0, 0]
            }
        },
        // 使用 graphic 组件绘制图文内容 (这是关键！)
        graphic: [
            {
                // 左侧：描述文本
                type: 'text',
                left: '10%',
                top: '35%',
                style: {
                    text: `【香事】${item.desc}\n\n【代表香材】${item.scent}\n\n【技艺特征】${item.feature.join('  |  ')}`,
                    font: '16px "Songti SC"',
                    fill: colors.main,
                    align: 'left',
                    verticalAlign: 'top',
                    lineHeight: 28
                }
            },
            {
                // 右侧：MasterGo 设计的插图 (这里用矩形占位，实际请替换为 image 类型)
                type: 'image',
                right: '10%',
                top: '30%',
                origin: 'center',
                style: {
                    image: item.imgPath, // 替换为真实 URL
                    width: 300,
                    height: 200,
                    opacity: 0.9,
                    shadowBlur: 20,
                    shadowColor: colors.light
                },
                // 添加一个淡入动画
                animation: 'fadeIn',
                animationDuration: 1000
            },
            {
                // 装饰：红色印章
                type: 'text',
                right: '12%',
                top: '32%',
                style: {
                    text: '■', // 或用 SVG 路径
                    font: '30px sans-serif',
                    fill: colors.red,
                    opacity: 0.6
                }
            }
        ],
        series: [{
            type: 'bar', // 用一个简单的柱状图做背景装饰，模拟“香粉堆积”
            data: [30, 45, 20, 60, 10], // 随机装饰数据
            barWidth: 20,
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colors.light },
                    { offset: 1, color: 'transparent' }
                ]),
                borderRadius: [10, 10, 0, 0]
            },
            silent: true, // 不响应鼠标事件
            z: -1 // 放在文字后面
        }]
    }))
};

// 设置配置项
historyChart.setOption(option);

// 响应式调整
window.addEventListener('resize', () => {
    historyChart.resize();
});