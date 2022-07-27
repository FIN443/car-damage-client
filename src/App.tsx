import { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import styled from "styled-components";
import "./styles.css";

const AppWrapper = styled.div`
  padding: 20px;
`;

const Loading = styled.div``;

const ImageWrapper = styled.div``;

const Submit = styled.button`
  text-align: center;
  margin-top: 20px;
  padding: 15px 4px;
  border: none;
  background-color: #85cdea;
  border-radius: 6px;
  width: 120px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  &:hover {
    background-color: #72b1ca;
  }
`;

const ResultWrapper = styled.div``;

interface ImageTypes {
  dataURL: string;
  file: FileTypes;
}

interface FileTypes {
  size: number;
  lastModifies: number;
  lastModifiedDate: Date;
  name: string;
  type: string;
  webkitRelativePath: string;
}

interface ResponseTypes {
  data: DataTypes[];
  message: string;
  ok: boolean;
}

interface DataTypes {
  imageBytes: string;
  kind: string[];
}

interface PredImageTypes extends Array<DataTypes> {}

export function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [predImages, setPredImages] = useState<PredImageTypes>([]);
  const maxNumber = 69;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    // console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  async function handleUpload(event: any) {
    event.preventDefault();
    setLoading(true);

    const address = "http://localhost:5555/predict";
    let data = new FormData();
    await Promise.all(
      images.map(async (image: ImageTypes, idx) => {
        // console.log(image);
        const imgURL = image.dataURL;
        await fetch(imgURL)
          .then((res) => res.blob())
          .then((blob) => {
            data.append(`image${idx}`, blob, `image${idx}.png`);
          });
      })
    );

    fetch(address, {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data: ResponseTypes) => {
        // console.log(data);
        setPredImages(data.data);
        setLoading(false);
      })
      .catch((error) => {
        // console.log(`error: ${error}`);
        setLoading(false);
      });
  }

  return (
    <AppWrapper className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <ImageWrapper className="upload__image-wrapper">
            <button
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.dataURL} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </ImageWrapper>
        )}
      </ImageUploading>
      <form onSubmit={handleUpload}>
        <Submit>이미지 제출</Submit>
      </form>
      {loading ? (
        <Loading>제출 중</Loading>
      ) : predImages?.length > 0 ? (
        <ResultWrapper>
          {predImages.map((data, idx) => (
            <>
              <div>
                {data.kind.map((item) => (
                  <span>{item} / </span>
                ))}
              </div>
              <img
                src={`data:image/png;base64,${data.imageBytes}`}
                alt="pred"
              />
            </>
          ))}
        </ResultWrapper>
      ) : (
        <></>
      )}
    </AppWrapper>
  );
}

export default App;
