import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareMinus,
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faCheckCircle,
} from "@fortawesome/free-regular-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import styled from "styled-components";
import "./styles.css";
import { Helmet } from "react-helmet";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const AddressForm = styled.form`
  display: flex;
  width: 800px;
  justify-content: space-between;
  align-items: center;
  min-width: 800px;
  margin: 20px;
`;

const Address = styled.input`
  width: 650px;
  padding: 14px 20px;
  font-size: 18px;
  border-radius: 8px;
  border: 1px solid;
`;

const AddressApply = styled.button`
  width: 70px;
  height: 100%;
  background-color: orange;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  transition: background-color 0.12s ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: #ff8000;
  }
  &:active {
    background-color: orangered;
  }
`;

const ApplyStatus = styled(FontAwesomeIcon)`
  color: yellowgreen;
  font-size: 20px;
  width: 30px;
`;

const Loading = styled.div``;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const AddButton = styled.button`
  width: 100%;
  height: 120px;
  margin-bottom: 20px;
  border: 1px dashed rgba(0, 0, 0, 1);
  border-radius: 12px;
  box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.1);
  background-color: #fdd07cb8;
  transition: all 0.12s ease-in-out;
  &:hover {
    background-color: #ffbf48dc;
    color: orangered;
    cursor: pointer;
  }
`;

const RemoveAllButton = styled.button`
  width: 100%;
  margin-bottom: 20px;
  border: none;
  background-color: #ff6730;
  border-radius: 8px;
  color: white;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: orangered;
    cursor: pointer;
  }
  &:active {
    background-color: red;
  }
`;

const AddedImageThumb = styled.img`
  height: 190px;
  width: 190px;
  object-fit: cover;
`;

const RemoveButton = styled(FontAwesomeIcon)`
  position: absolute;
  top: 0px;
  right: 5px;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  transition: color 0.12s ease-in-out;
  &:hover {
    cursor: pointer;
    color: orange;
  }
  &:active {
    color: red;
  }
`;

const AddedImages = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 800px;
  background-color: #fff9f3;
  border-radius: 8px;
  padding: 10px;
  min-height: 200px;
  box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
`;
const AddedImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 25%;
  transition: opacity 0.12s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const Submit = styled.button`
  text-align: center;
  margin-top: 20px;
  padding: 15px 4px;
  border: none;
  background-color: orange;
  color: white;
  border-radius: 6px;
  width: 800px;
  cursor: pointer;
  transition: background-color 0.12s ease-in-out;
  margin-bottom: 20px;
  &:hover {
    background-color: #ff7700;
  }
  &:active {
    background-color: orangered;
  }
  &:disabled {
    background-color: gray;
    cursor: default;
  }
`;

const ResultWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0px;
  position: relative;
  min-height: 700px;
`;

const ResultContent = styled(motion.div)`
  display: flex;
  position: absolute;
  top: 80px;
  flex-direction: column;
  margin-bottom: 10px;
`;

const ResultKinds = styled.div`
  display: flex;
  padding: 8px 10px;
  border: 1px solid;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
`;

const ResultKind = styled.span`
  margin-right: 20px;
  padding: 4px 6px;
  border-radius: 4px;
  background-color: orangered;
  color: white;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.2);
`;

const ResultImageContent = styled.div`
  display: flex;
  width: 600px;
  flex-direction: column;
`;

const ResultImage = styled.img`
  object-fit: cover;
  border-radius: 0 0 8px 8px;
`;

const ResultButtonContent = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4px;
  margin-bottom: 40px;
`;

const ResultControl = styled(FontAwesomeIcon)`
  font-size: 40px;
  margin: 0 10px;
  transition: color 0.12s ease-in-out;
  &:hover {
    cursor: pointer;
    color: orange;
  }
  &:active {
    color: red;
  }
`;

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
  const [text, setText] = useState(
    "https://모델서버-주소을-넣어주세요/predict"
  );
  const [address, setAddress] = useState("");
  const maxNumber = 8;

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

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  function handleAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pathname = text.split("://");
    setAddress(`https://${pathname[pathname.length - 1]}`);
    console.log(address);
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    else if (images.length < 1) return;
    setLoading(true);

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
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.141 Whale/3.15.136.29 Safari/537.36",
      },
      body: data,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data: ResponseTypes) => {
        console.log(data);
        setPredImages(data.data);
        setVisible(1);
        setLoading(false);
      })
      .catch((error) => {
        // console.log(`error: ${error}`);
        setLoading(false);
      });
  }
  return (
    <>
      <Helmet>
        <title>차량 파손 탐지</title>
      </Helmet>
      <AppWrapper className="App">
        <AddressForm onSubmit={handleAddress}>
          <Address
            onChange={onChangeText}
            value={text}
            type="text"
            placeholder="모델 서버 주소 (ex: https://0227-35-231-130-113.ngrok.io/predict)"
          />
          <AddressApply>적용</AddressApply>
          <ApplyStatus
            icon={faCheckCircle}
            opacity={address === "" ? 0 : 1}
          ></ApplyStatus>
        </AddressForm>
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
              <AddButton onClick={onImageUpload} {...dragProps}>
                Click or Drop here
              </AddButton>
              <RemoveAllButton onClick={onImageRemoveAll}>
                모든 이미지 제거
              </RemoveAllButton>
              <AddedImages>
                {imageList.map((image, index) => (
                  <AddedImage key={index} className="image-item">
                    <AddedImageThumb
                      onClick={() => onImageUpdate(index)}
                      src={image.dataURL}
                      alt=""
                    />
                    <RemoveButton
                      onClick={() => onImageRemove(index)}
                      icon={faSquareMinus}
                    />
                  </AddedImage>
                ))}
              </AddedImages>
            </ImageWrapper>
          )}
        </ImageUploading>
        <form onSubmit={handleUpload}>
          <Submit disabled={images.length < 1 ? true : loading ? true : false}>
            이미지 제출
          </Submit>
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
                    <ResultKinds>
                      {data.kind.map((item) => (
                        <ResultKind>{item}</ResultKind>
                      ))}
                    </ResultKinds>
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
              <ResultControl onClick={getPrev} icon={faArrowAltCircleLeft} />
              <ResultControl onClick={getNext} icon={faArrowAltCircleRight} />
            </ResultButtonContent>
          </ResultWrapper>
        ) : (
          <></>
        )}
      </AppWrapper>
    </>
  );
}

export default App;
