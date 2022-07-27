import { AnimatePresence, motion } from "framer-motion";
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

const ResultWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0px;
  position: relative;
  height: 60vh;
`;

const ResultContent = styled(motion.div)`
  display: flex;
  position: absolute;
  top: 60px;
  flex-direction: column;
  margin-bottom: 10px;
`;

const ResultKind = styled.span`
  margin-right: 20px;
`;

const ResultImageContent = styled.div`
  display: flex;
  width: 600px;
  flex-direction: column;
`;

const ResultImage = styled.img`
  object-fit: cover;
`;

const ResultButtonContent = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4px;
  margin-bottom: 40px;
`;

const ResultButton = styled.button``;

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

const boxVariant = {
  entry: (isBack: boolean) => ({
    x: isBack ? -1000 : 1000,
    opacity: 0,
    scale: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
    },
  },
  exit: (isBack: boolean) => ({
    x: isBack ? 1000 : -1000,
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.8,
    },
  }),
};

export function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [predImages, setPredImages] = useState<PredImageTypes>([]);
  const [visible, setVisible] = useState<number>(1);
  const [back, setBack] = useState<boolean>(false);
  const maxNumber = 5;

  const getNext = () => {
    setBack(false);
    setVisible((prev) => (prev === predImages.length ? 1 : prev + 1));
  };
  const getPrev = () => {
    setBack(true);
    setVisible((prev) => (prev === 1 ? predImages.length : prev - 1));
  };

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
          <AnimatePresence custom={back}>
            {predImages.map((data, idx) =>
              idx + 1 === visible ? (
                <ResultContent
                  custom={back}
                  variants={boxVariant}
                  initial="entry"
                  animate="center"
                  exit="exit"
                  key={visible}
                >
                  <div>
                    {data.kind.map((item) => (
                      <ResultKind>{item}</ResultKind>
                    ))}
                  </div>
                  <ResultImageContent>
                    <ResultImage
                      src={`data:image/png;base64,${data.imageBytes}`}
                      alt="pred"
                    />
                  </ResultImageContent>
                </ResultContent>
              ) : null
            )}
          </AnimatePresence>
          <ResultButtonContent>
            <ResultButton onClick={getPrev}>이전</ResultButton>
            <ResultButton onClick={getNext}>다음</ResultButton>
          </ResultButtonContent>
        </ResultWrapper>
      ) : (
        <></>
      )}
    </AppWrapper>
  );
}

export default App;
