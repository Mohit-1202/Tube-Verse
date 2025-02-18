import { useContext, useState } from "react";
import VideoContext from "../../Context/Videos/VideoContext";

export default function AddVideo() {
    const context = useContext(VideoContext);
    const { uploadVideo } = context;

    const [video, setVideo] = useState({
        title: "",
        description: "",
        thumbnail: null,
        videoFile: null
    });

    const handleClick = (e) => {
        e.preventDefault(); // Prevent form from refreshing the page
        uploadVideo(video.title, video.description, video.thumbnail, video.videoFile);
        setVideo({ title: "", description: "", thumbnail: null, videoFile: null });
    };

    const onChange = (e) => {
        if (e.target.type === "file") {
            setVideo({ ...video, [e.target.name]: e.target.files[0] });
        } else {
            setVideo({ ...video, [e.target.name]: e.target.value });
        }
    };

    return (
        <div>
            <form onSubmit={handleClick}>
                <input type="text" id="title" name="title" value={video.title} onChange={onChange} placeholder="Title" />
                <input type="text" id="description" name="description" value={video.description} onChange={onChange} placeholder="Description" />
                <input type="file" id="thumbnail" name="thumbnail" onChange={onChange} />
                <input type="file" id="videoFile" name="videoFile" onChange={onChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
