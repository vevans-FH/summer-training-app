import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { TRAINING_SCHEDULE } from '../data/trainingData';
import moment from 'moment';

const WorkoutScreen = ({ navigation }) => {
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);

  useEffect(() => {
    findTodayWorkout();
  }, []);

  const findTodayWorkout = () => {
    const today = moment();
    const dayName = today.format('dddd');

    // Find which week we're in
    const startDate = moment('2026-06-15');
    const daysDiff = today.diff(startDate, 'days');
    
    if (daysDiff < 0) {
      setTodayWorkout({
        message: 'Training starts June 15, 2026',
        day: dayName,
      });
      return;
    }

    const weekNumber = Math.floor(daysDiff / 7) + 1;
    
    if (weekNumber > 9) {
      setTodayWorkout({
        message: 'Training program completed! Great job!',
        day: dayName,
      });
      return;
    }

    setCurrentWeek(weekNumber);
    const week = TRAINING_SCHEDULE.find(w => w.number === weekNumber);
    if (week) {
      const day = week.days.find(d => d.name === dayName);
      if (day) {
        setTodayWorkout({ ...day, week: weekNumber });
      } else {
        setTodayWorkout({ message: `No workout scheduled for ${dayName}` });
      }
    }
  };

  const handleStartWorkout = () => {
    if (todayWorkout && currentWeek) {
      navigation.navigate('Schedule', {
        screen: 'ScheduleList',
        params: {
          week: currentWeek,
          day: todayWorkout.name,
          workout: todayWorkout,
        },
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.dateTitle}>{moment().format('dddd, MMMM D')}</Title>
          <Paragraph style={styles.subtitle}>Week {currentWeek || '?'}</Paragraph>
        </Card.Content>
      </Card>

      {todayWorkout ? (
        <>
          {todayWorkout.message ? (
            <Card style={styles.messageCard}>
              <Card.Content>
                <Paragraph style={styles.messageText}>{todayWorkout.message}</Paragraph>
              </Card.Content>
            </Card>
          ) : (
            <>
              <Card style={styles.workoutCard}>
                <Card.Content>
                  <Title style={styles.workoutTitle}>{todayWorkout.type || 'Workout'}</Title>
                  <Paragraph style={styles.exerciseCount}>
                    {todayWorkout.exercises?.length || 0} exercises
                  </Paragraph>
                  {todayWorkout.exercises && todayWorkout.exercises.slice(0, 3).map((exercise, index) => (
                    <Paragraph key={index} style={styles.exercisePreview}>
                      • {exercise.name} - {exercise.sets} x {exercise.reps}
                    </Paragraph>
                  ))}
                  {todayWorkout.exercises && todayWorkout.exercises.length > 3 && (
                    <Paragraph style={styles.moreExercises}>
                      +{todayWorkout.exercises.length - 3} more exercises
                    </Paragraph>
                  )}
                </Card.Content>
              </Card>
              
              <Button
                mode="contained"
                style={styles.startButton}
                onPress={handleStartWorkout}
              >
                Start Workout
              </Button>
            </>
          )}
        </>
      ) : (
        <Card style={styles.loadingCard}>
          <Card.Content>
            <Paragraph>Loading workout...</Paragraph>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    marginBottom: 20,
    backgroundColor: '#6200ee',
  },
  dateTitle: {
    color: '#fff',
    fontSize: 24,
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 14,
    marginTop: 4,
  },
  workoutCard: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  exerciseCount: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  exercisePreview: {
    color: '#333',
    fontSize: 13,
    marginTop: 8,
  },
  moreExercises: {
    color: '#999',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  startButton: {
    paddingVertical: 8,
    backgroundColor: '#4caf50',
    marginBottom: 20,
  },
  messageCard: {
    marginTop: 20,
    backgroundColor: '#fff3e0',
  },
  messageText: {
    color: '#e65100',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingCard: {
    marginTop: 20,
  },
});

export default WorkoutScreen;
