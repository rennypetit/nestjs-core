import { Exclude } from 'class-transformer';
import { Upload } from 'src/uploads/entities/upload.entity';
import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'text', name: 'seo_title' })
  seoTitle: string;

  @Column({ nullable: true, type: 'text', name: 'seo_description' })
  seoDescription: string;

  @Column({ nullable: true, type: 'text', name: 'seo_keywords' })
  seoKeywords: string;

  @Column({ nullable: true, type: 'text', name: 'seo_canonical' })
  seoCanonical: string;

  @Column({ nullable: true, type: 'text', name: 'seo_image' })
  seoImage: string;

  @Column({ nullable: true, type: 'text', name: 'seo_json_ld' })
  seoJsonLd: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'boolean' })
  publish: boolean;

  @Exclude()
  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];

  @ManyToOne(() => Upload, (upload) => upload.categories)
  @JoinColumn({ name: 'image_id' })
  image: Upload;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
