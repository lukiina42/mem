import { Mem } from 'src/mem/mem.entity';
import { MemDto } from 'src/mem/mem.service';
import { S3Service } from 'src/s3/s3.service';
import { User } from 'src/user/user.entity';

export const mapMemsDbToDto = async (
  mems: Mem[],
  user: User,
  s3Service: S3Service,
): Promise<MemDto[]> => {
  const memsFe = [];

  for (let i = 0; i < mems.length; i++) {
    const mem: MemDto = mems[i];
    if (mem.imageKey) {
      const imageUrl = await s3Service.retrieveImage(mem.imageKey);
      mem.imageUrl = imageUrl;
    }

    const userAvatarKey = mem.owner.avatarImageKey;
    if (userAvatarKey) {
      mem.owner.avatarImageUrl = await s3Service.retrieveImage(userAvatarKey);
    }

    if (!user || !user.heartedMems) {
      mem.heartedByCurrentUser = false;
    } else {
      if (user.heartedMems.find((userMem) => mem.id === userMem.id)) {
        mem.heartedByCurrentUser = true;
      } else {
        mem.heartedByCurrentUser = false;
      }
    }

    memsFe.push(mem);
  }

  return memsFe;
};
