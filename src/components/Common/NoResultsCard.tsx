import React from 'react';
import { Card } from 'react-bootstrap';

interface NoResultsCardProps {
  title?: string;
  message?: string;
}

const NoResultsCard: React.FC<NoResultsCardProps> = ({
  title = 'No results found',
  message = 'Try adjusting your search terms or browse all items'
}) => {
  return (
    <Card className="text-center border-0 shadow-sm">
      <Card.Body className="py-5">
        <h3 className="text-dark mb-2">{title}</h3>
        <p className="text-muted">{message}</p>
      </Card.Body>
    </Card>
  );
};

export default NoResultsCard;
