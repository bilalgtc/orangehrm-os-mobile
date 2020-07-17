/*
 * This file is part of OrangeHRM
 *
 * Copyright (C) 2020 onwards OrangeHRM (https://www.orangehrm.com/)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import MainLayout from 'layouts/MainLayout';
import withTheme, {WithTheme} from 'lib/hoc/withTheme';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {selectPartialOption} from 'store/leave/apply-leave/selectors';
import {pickMultipleDayPartialOption as pickMultipleDayPartialOptionAction} from 'store/leave/apply-leave/actions';
import Button from 'components/DefaultButton';
import RadioItem from 'components/DefaultRadioItem';
import Text from 'components/DefaultText';
import Divider from 'components/DefaultDivider';
import {ApplyLeaveNavigatorParamList} from 'screens/leave/navigators/ApplyLeaveNavigator';
import PickPartialDayDuration from 'screens/leave/components/PickPartialDayDuration';
import {PICK_LEAVE_REQUEST_DURATION} from 'screens';
import {
  HALF_DAY,
  HALF_DAY_MORNING,
  PARTIAL_OPTION_NONE,
  PARTIAL_OPTION_ALL,
  PARTIAL_OPTION_START,
  PARTIAL_OPTION_END,
  PARTIAL_OPTION_START_END,
  MultipleDayPartialOption,
} from 'store/leave/apply-leave/types';
import {isValidPartialOptionSpecifyTime} from 'lib/helpers/leave';

class PickLeaveRequestPartialDays extends React.Component<
  PickLeaveRequestPartialDaysProps
> {
  onPressContinue = (partialOption?: MultipleDayPartialOption) => () => {
    if (isValidPartialOptionSpecifyTime(partialOption)) {
      this.props.navigation.goBack();
    }
  };

  isPartialOptionNone = (partialOption?: MultipleDayPartialOption) => {
    return partialOption?.partialOption === PARTIAL_OPTION_NONE;
  };

  isPartialOptionStart = (partialOption?: MultipleDayPartialOption) => {
    return partialOption?.partialOption === PARTIAL_OPTION_START;
  };

  isPartialOptionEnd = (partialOption?: MultipleDayPartialOption) => {
    return partialOption?.partialOption === PARTIAL_OPTION_END;
  };

  isPartialOptionAll = (partialOption?: MultipleDayPartialOption) => {
    return partialOption?.partialOption === PARTIAL_OPTION_ALL;
  };

  isPartialOptionStartEnd = (partialOption?: MultipleDayPartialOption) => {
    return partialOption?.partialOption === PARTIAL_OPTION_START_END;
  };

  render() {
    const {
      theme,
      applyLeavePartialOption,
      pickApplyLeaveMultipleDayPartialOption,
    } = this.props;

    let partialOption = applyLeavePartialOption;
    let pickMultipleDayPartialOption = pickApplyLeaveMultipleDayPartialOption;

    const radioStyle = {paddingVertical: theme.spacing * 2};

    return (
      <MainLayout
        footer={
          <View
            style={{
              paddingHorizontal: theme.spacing * 12,
              paddingVertical: theme.spacing * 2,
              backgroundColor: theme.palette.background,
            }}>
            <Button
              title={'Continue'}
              primary
              fullWidth
              onPress={this.onPressContinue(partialOption)}
            />
          </View>
        }>
        <View
          style={[
            styles.rootView,
            {
              paddingBottom: theme.spacing * 2,
              backgroundColor: theme.palette.backgroundSecondary,
            },
          ]}>
          <View
            style={{
              backgroundColor: theme.palette.background,
            }}>
            <Text bold style={{padding: theme.spacing * 4}}>
              {'Select Your Partial Leave Day(s)'}
            </Text>
            <Divider />
            <View
              style={{
                paddingHorizontal: theme.spacing * 8,
                paddingVertical: theme.spacing * 2,
              }}>
              <RadioItem
                title={'None'}
                radioProps={{selected: this.isPartialOptionNone(partialOption)}}
                style={{...radioStyle}}
                onPress={() => {
                  pickMultipleDayPartialOption({
                    partialOption: PARTIAL_OPTION_NONE,
                  });
                }}
              />
              <RadioItem
                title={'All Days'}
                radioProps={{selected: this.isPartialOptionAll(partialOption)}}
                style={{...radioStyle}}
                onPress={() => {
                  pickMultipleDayPartialOption({
                    partialOption: PARTIAL_OPTION_ALL,
                    startDayType: HALF_DAY,
                    startDayAMPM: HALF_DAY_MORNING,
                  });
                }}
              />
              <RadioItem
                title={'Start Day Only'}
                radioProps={{
                  selected: this.isPartialOptionStart(partialOption),
                }}
                style={{...radioStyle}}
                onPress={() => {
                  pickMultipleDayPartialOption({
                    partialOption: PARTIAL_OPTION_START,
                    startDayType: HALF_DAY,
                    startDayAMPM: HALF_DAY_MORNING,
                  });
                }}
              />
              <RadioItem
                title={'End Day Only'}
                radioProps={{selected: this.isPartialOptionEnd(partialOption)}}
                style={{...radioStyle}}
                onPress={() => {
                  pickMultipleDayPartialOption({
                    partialOption: PARTIAL_OPTION_END,
                    endDayType: HALF_DAY,
                    endDayAMPM: HALF_DAY_MORNING,
                  });
                }}
              />
              <RadioItem
                title={'Start and End Day'}
                radioProps={{
                  selected: this.isPartialOptionStartEnd(partialOption),
                }}
                style={{...radioStyle}}
                onPress={() => {
                  pickMultipleDayPartialOption({
                    partialOption: PARTIAL_OPTION_START_END,
                    startDayType: HALF_DAY,
                    startDayAMPM: HALF_DAY_MORNING,
                    endDayType: HALF_DAY,
                    endDayAMPM: HALF_DAY_MORNING,
                  });
                }}
              />
            </View>
          </View>
        </View>
        <PickPartialDayDuration
          partialOption={partialOption}
          pickMultipleDayPartialOption={pickMultipleDayPartialOption}
        />
      </MainLayout>
    );
  }
}

interface PickLeaveRequestPartialDaysProps
  extends WithTheme,
    ConnectedProps<typeof connector> {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<
    ApplyLeaveNavigatorParamList,
    typeof PICK_LEAVE_REQUEST_DURATION
  >;
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});

const mapStateToProps = (state: RootState) => ({
  applyLeavePartialOption: selectPartialOption(state),
});

const mapDispatchToProps = {
  pickApplyLeaveMultipleDayPartialOption: pickMultipleDayPartialOptionAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const PickLeaveRequestPartialDaysWithTheme = withTheme<
  PickLeaveRequestPartialDaysProps
>()(PickLeaveRequestPartialDays);

export default connector(PickLeaveRequestPartialDaysWithTheme);
