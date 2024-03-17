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
  Pagination
} from 'semantic-ui-react';
import he from 'he';

import Countdown from '../Countdown';
import { getLetter } from '../../utils';

const Quiz = ({ data, countdownTime, endQuiz }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userSlectedAns, setUserSlectedAns] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);

  useEffect(() => {
    if (questionIndex > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [questionIndex]);

  const handleItemClick = (e, { name }) => {
    let myArr=userSlectedAns;
    if(e.ctrlKey){
      
      myArr[questionIndex].push(name);
      
    }else
    myArr[questionIndex]=[name];
     
    setUserSlectedAns(myArr);
    
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
    let point = 0;

    if (userSlectedAns && userSlectedAns[questionIndex] && JSON.stringify(userSlectedAns[questionIndex].sort()) === he.decode(JSON.stringify(data[questionIndex].correct_answers.sort()))) {
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
                          active={userSlectedAns && userSlectedAns[questionIndex] && userSlectedAns[questionIndex].indexOf(decodedOption)!==-1}
                          onClick={handleItemClick}
                        >
                          <b style={{ marginRight: '8px' }}>{letter}</b>
                          {decodedOption}
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
