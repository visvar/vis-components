
<script>
    import {Flower} from './FlowerGlyph'

    /*
    'flowerData' has this object structure:
    {
        '1': {color: '#ff0000', relValue: 0},
        '2': {color: '#00ff00', relValue: .25},
        '3': {color: '#ffff00', relValue: .5},
        '5': {color: '#00ffff', relValue: .75},
        '6': {color: '#0000ff', relValue: 1}
    }
    */
    export let flowerData;
    export let radius;
    export let centerPos;

    let canvas;

    $: if (canvas) {
        let ctx = canvas.getContext("2d");
        new Flower(ctx, radius, 
                        centerPos.x, 
                        centerPos.y, 
                        flowerData, 
                        {symmetryFactor: .5, widthToLengthRatio: 1.1})
                        .draw();

    }
</script>

<canvas style="" bind:this={canvas} width={2*radius} height={2*radius}></canvas> 