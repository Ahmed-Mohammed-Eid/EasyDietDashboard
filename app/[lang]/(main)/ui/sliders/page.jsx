import SliderList from "../../../../components/Main/Carousel/SliderList/SliderList";

export default function Slider({params: {lang}}) {
    return (
        <div>
            <SliderList lang={lang}/>
        </div>
    );
}