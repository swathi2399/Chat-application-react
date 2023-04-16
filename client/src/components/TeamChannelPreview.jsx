import React from 'react';
import {Avatar,useChatContext} from 'stream-chat-react';

const TeamChannelPreview = ({channel,type,setToggleContainer,setIsCreating,setIsEditing,setActiveChannel}) => {
    // console.log(channel)
    const {channel: activeChannel, client} = useChatContext();
    console.log(channel.id , activeChannel.id)
    const ChannelPreview = () => (
        <p className='channel-preview__item'>
            # {channel?.data?.name || channel?.data?.id}
        </p>

    );
    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(({user}) => user.id !== client.userID );
        console.log(members[0])
    
    return (
        <div className='channel_preview__item single'>
            <Avatar
            image = {members[0]?.user?.image}
            name = {members[0]?.user?.fullName}
            size = {24}
            />
            <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>

        </div>
    )
}
   

  return (
    <div className={
        channel?.id === activeChannel?.id
        ? 'channel-preview__wrapper__selected'
        : 'channel-preview__wrapper'
    }
    onClick = {() =>  {
        setIsCreating(false); // because we are no longer creating or editing a channel
        setIsEditing(false);
        setActiveChannel(channel);

        if(setToggleContainer) {
            setToggleContainer((prevState) => !prevState);
        }
    }}
    >

        {/* {channel}
        {activeChannel} */}
        {type === 'team' ? <ChannelPreview/> : <DirectPreview />}
      
    </div>
  )
}

export default TeamChannelPreview
