import { ResponsivePie } from '@nivo/pie';

const PieChart = ({ data }) => (
    <ResponsivePie
        data={data}
        sortByValue={true}
        valueFormat=" >-$0,~"
        margin={{ top:15, right:120, bottom: 15, left: 10}}
        padAngle={0.1}
        cornerRadius={0}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['brighter', '3']] }}
        radialLabelsTextXOffset={0}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={-6}
        radialLabelsLinkDiagonalLength={10}
        radialLabelsLinkHorizontalLength={0}
        radialLabelsLinkColor={{ from: 'color' }}
        sliceLabelsRadiusOffset={0.65}
        sliceLabelsTextColor="#333333"
        legends={[
            {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 105,
                translateY: 0,
                itemWidth: 90,
                itemHeight: 20,
                itemsSpacing: 3,
                symbolSize: 7,
                itemDirection: 'left-to-right'
            }
        ]}
    />
)

export default PieChart