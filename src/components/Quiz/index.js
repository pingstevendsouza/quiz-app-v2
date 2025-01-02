import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Segment,
  Item,
  Divider,
  Button,
  Icon,
  Message,
  Menu,
  Header,
  Pagination,
  Checkbox
} from 'semantic-ui-react';
import he from 'he';


import Countdown from '../Countdown';
import { getLetter } from '../../utils';

const Quiz = ({ data, countdownTime, endQuiz }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userSlectedAns, setUserSlectedAns] = useState([]);
  const [checked, setChecked] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);
  const [questionsType, setQuestionsType] = useState(data[questionIndex].correct_answers.length>1?"multiple":"single");
  

  useEffect(() => {
    if (questionIndex > 0) window.scrollTo({ top: 0, behavior: 'smooth' });

    setQuestionsType(data[questionIndex].correct_answers.length>1?"multiple":"single");
    
  }, [questionIndex]);


   
  const checkBoxOnChange = (data, dataIndex, decodedOption) => {
    const updatedAnswers = [...userSlectedAns];
    
    if (questionsType === "multiple") {
      if (!updatedAnswers[questionIndex]) updatedAnswers[questionIndex] = [];
  
      if (data.checked) {
        // Add the option if selected
        updatedAnswers[questionIndex] = [...updatedAnswers[questionIndex], decodedOption];
      } else {
        // Remove the option if unselected
        updatedAnswers[questionIndex] = updatedAnswers[questionIndex].filter(
          (option) => option !== decodedOption
        );
      }
    } else {
      // Single choice question
      updatedAnswers[questionIndex] = [decodedOption];
    }
  
    setUserSlectedAns(updatedAnswers);
  };
  

  const handleItemClick = (e, props) => {
    const updatedChecked = [...checked];
    const dataIndex = props.children.props.dataIndex;
    const decodedOption = props.children.props.decodedOption;
  
    if (questionsType === "multiple") {
      if (!updatedChecked[questionIndex]) updatedChecked[questionIndex] = {};
      updatedChecked[questionIndex][dataIndex] = !updatedChecked[questionIndex][dataIndex];
    } else {
      updatedChecked[questionIndex] = { [dataIndex]: true };
    }
  
    setChecked(updatedChecked);
  
    const myData = {
      checked: updatedChecked[questionIndex][dataIndex],
    };
  
    checkBoxOnChange(myData, dataIndex, decodedOption);
  };
  

  const handleNext = () => {

    let point = 0;

    if (JSON.stringify(userSlectedAns[questionIndex].sort()) === he.decode(JSON.stringify(data[questionIndex].correct_answers.sort()))) {
      point = 1;
    }

    const qna = questionsAndAnswers;
    qna.push({
      question: he.decode(data[questionIndex].question),
      user_answer: userSlectedAns[questionIndex],
      correct_answer: data[questionIndex].correct_answers.map((i)=>{return he.decode(i); }),
      point,
    });

    if (questionIndex === data.length - 1) {
      return endQuiz({
        totalQuestions: data.length,
        correctAnswers: correctAnswers + point,
        timeTaken,
        questionsAndAnswers: qna,
      });
    }

    setCorrectAnswers(correctAnswers + point);
    setQuestionIndex(questionIndex + 1);
 //   setUserSlectedAns(null);
    setQuestionsAndAnswers(qna);
  };

  const handlePrev = () => {
    debugger;
    let point = 0;

    if (userSlectedAns && userSlectedAns[questionIndex-1] && JSON.stringify(userSlectedAns[questionIndex-1].sort()) === he.decode(JSON.stringify(data[questionIndex-1].correct_answers.sort()))) {
      point = 1;
    }
    setCorrectAnswers(correctAnswers - point);
    const qna = questionsAndAnswers;
    qna.pop();
    setQuestionsAndAnswers(qna);
    setQuestionIndex(questionIndex - 1);
    
  }

  const handlePaginationChange =(e, { activePage })=>{
    setQuestionIndex(activePage - 1);
  }

  const timeOver = timeTaken => {
    return endQuiz({
      totalQuestions: data.length,
      correctAnswers,
      timeTaken,
      questionsAndAnswers,
    });
  };

  return (
    <Item.Header>
      <Container>
        <Segment>
          <Item.Group divided>
            <Item>
              <Item.Content>
                <Item.Extra>
                  <Header as="h1" block floated="left">
                    <Icon name="info circle" />
                    <Header.Content>
                      {`Question No.${questionIndex + 1} of ${data.length}`}
                    </Header.Content>
                  </Header>
                  <Countdown
                    countdownTime={countdownTime}
                    timeOver={timeOver}
                    setTimeTaken={setTimeTaken}
                  />
                </Item.Extra>
                <br />
                <Item.Meta>
                  <Message size="huge" floating>
                    <b>{`Q. ${he.decode(data[questionIndex].question)}`}</b>
                  </Message>
                  <br />
                  <Item.Description>
                    <h3>Please choose of the following answers:</h3>
                  </Item.Description>
                  <Divider />
                  <Menu vertical fluid size="massive">
                    {data[questionIndex].options.map((option, i) => {
                      const letter = getLetter(i);
                      const decodedOption = he.decode(option);
                      return (
                        <Menu.Item
                          key={decodedOption}
                          name={decodedOption}
                          active={checked[questionIndex] && checked[questionIndex][i]}
                          onClick={handleItemClick}
                        >
                          <Checkbox 
                          radio={data[questionIndex].correct_answers.length>1?false:true}
                          name={data[questionIndex].correct_answers.length>1?"question"+questionIndex+i:"question"+questionIndex}
                          label={<label><b style={{ marginRight: '8px', marginLeft: '8px' }}>{letter}</b>
                          {decodedOption}</label>}
                            onChange={(e, data) => {
                              e.preventDefault();
                              e.stopPropagation();
                              let myCheck=checked;
                              if(questionsType=="multiple"){
                              if(!myCheck[questionIndex]) myCheck[questionIndex]={};
                              myCheck[questionIndex][i]=data.checked;
                              }else{
                                myCheck[questionIndex]={};
                                myCheck[questionIndex][i]=data.checked;
                              }
                              setChecked(myCheck); 
                              checkBoxOnChange(data,i,decodedOption);

                            }}
                            checked={(checked[questionIndex] && checked[questionIndex][i])?true:false}
                            dataIndex={i}
                            option={letter}
                            decodedOption={decodedOption}
                          />
                          
                          
                        </Menu.Item>
                      );
                    })}
                  </Menu>
                </Item.Meta>
                <Divider />
                <Item.Extra>
                {questionIndex>=1?<><Button
                    primary
                    content="Previous"
                    onClick={handlePrev}
                    floated="left"
                    size="big"
                    icon="left chevron"
                    labelPosition="left"
                  />
                  {/* <Pagination
                  activePage={activePage}
                  onPageChange={handlePaginationChange}
                  totalPages={data.length}npm
                /> */}
                </>:<></>}
                  
                  <Button
                    color={questionIndex === data.length -1?"green":"primary"}                   
                    content={questionIndex === data.length - 1?"Submit":"Next"}
                    onClick={handleNext}
                    floated="right"
                    size="big"
                    icon={questionIndex === data.length -1?"check circle outline":"right chevron"}
                    labelPosition="right"
                    disabled={!userSlectedAns[questionIndex]?.length}
                  />
                  
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <br />
      </Container>
    </Item.Header>
  );
};

Quiz.propTypes = {
  data: PropTypes.array.isRequired,
  countdownTime: PropTypes.number.isRequired,
  endQuiz: PropTypes.func.isRequired,
};

export default Quiz;
